import React from "react";

import styles from "./SheetHeader.module.scss";
import {
	AttributeKey,
	CharacterSheet,
	DiceSides,
	SecondaryAttribute,
	SecondaryAttributeKey,
	XpType,
} from "../../shared/types";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import {
	CheckOutlined,
	CopyOutlined,
	DeleteOutlined,
	EditOutlined,
	ShareAltOutlined,
	UndoOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { termsList } from "../../shared/constants";
import {
	cloneObj,
	diceSideNumberFromLevel,
	getSessionStorage,
	onlyNumbers,
	setSessionStorage,
	withNamespace,
} from "../../shared/helpers/utils";
import { useRecoilState } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { Button, Input, Modal } from "../";
import { useAntToast, useCharacterSheet } from "../../shared/hooks";
import { Popconfirm, Popover } from "antd";

export type SheetHeaderProps = {
	className?: string;
	style?: React.CSSProperties;
};

export const SheetHeader = ({ className, style }: SheetHeaderProps) => {
	const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
	const [editMode, setEditMode] = useRecoilState(sheetEditingState);
	const {
		data: {
			updateEditingSheet,
			saveCharacterSheet,
			deleteSheet,
			autoCalculations,
		},
	} = useCharacterSheet();
	const [shareModalOpen, setShareModalOpen] = React.useState(false);
	const [isImgEditPopoverOpen, setImgEditPopoverOpen] = React.useState(false);
	const [currentImgUrl, setCurrentImgUrl] = React.useState(
		activeSheet?.imageURL
	);
	const { openToast } = useAntToast();

	const handleEnterEditMode = () => {
		if (activeSheet) {
			setEditMode(true);
			setSessionStorage("backupActiveSheet", activeSheet, true);
			updateEditingSheet(activeSheet);
		}
	};

	const handleCancelEdits = () => {
		const backupSheet = getSessionStorage("backupActiveSheet", true);

		setActiveSheet(backupSheet);

		sessionStorage.removeItem(withNamespace("editingSheet"));
		sessionStorage.removeItem(withNamespace("backupActiveSheet"));

		setEditMode(false);
	};

	const handleSaveEdits = () => {
		if (activeSheet) {
			saveCharacterSheet(activeSheet);
		}
	};

	const updateImgUrl = (shouldUpdate = false) => {
		if (shouldUpdate) {
			const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

			cloneSheet.imageURL = currentImgUrl || "";

			updateEditingSheet(cloneSheet);
		}

		setImgEditPopoverOpen(false);
	};

	const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value: newName },
		} = event;
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.name = newName || "";

		setActiveSheet(cloneSheet);
	};

	const updateAttribute = (attrName: AttributeKey, attrValue: number) => {
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.attributes[attrName] = attrValue;

		autoCalculations(cloneSheet, true);
	};

	const updateSecondaryAttribute = (
		attrName: SecondaryAttributeKey,
		attrValue: number
	) => {
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.secondaryAttributes[attrName].current = attrValue;

		setActiveSheet(cloneSheet);
	};

	const updateSecondaryAttributeLimit = (
		attrKey: SecondaryAttributeKey,
		finalValue: number
	) => {
		const secondaryAttribute = cloneObj(
			activeSheet?.secondaryAttributes[attrKey]!
		) as SecondaryAttribute;

		if (secondaryAttribute) {
			const oldLimitRaw =
				(secondaryAttribute.finalLimit || 0) /
					(secondaryAttribute.finalMultiplier || 1) -
				(secondaryAttribute.limitBonus || 0);
			secondaryAttribute.limitBonus = finalValue - oldLimitRaw;

			const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

			cloneSheet.secondaryAttributes[attrKey] = secondaryAttribute;

			autoCalculations(cloneSheet, true);
		}
	};

	const updateXP = (xpType: XpType, xpValue: number) => {
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.xp[xpType] = xpValue;

		setActiveSheet(cloneSheet);
	};

	const openShareModal = () => {
		setShareModalOpen(true);
	};

	const copySheetCode = () => {
		const codeElement = document.getElementById(
			"sheetCodeField"
		) as HTMLTextAreaElement;

		if (!codeElement?.value) {
			return;
		}

		navigator.clipboard.writeText(codeElement.value);
		openToast("Ficha copiada");
	};

	const [attributesTermsList, secondaryAttributesTermsList] =
		React.useMemo(() => {
			if (!activeSheet) {
				return [[], []];
			}
			const attributes = Object.keys(activeSheet.attributes);
			const secondaryAttributes = Object.keys(activeSheet.secondaryAttributes);
			const attributesTerms: { [key: string]: string } = {};
			const secondaryAttributesTerms: { [key: string]: string } = {};

			attributes.forEach((attributeKey) => {
				attributesTerms[attributeKey] = termsList[attributeKey];
			});

			secondaryAttributes.forEach((attributeKey) => {
				secondaryAttributesTerms[attributeKey] = termsList[attributeKey];
			});

			return [attributesTerms, secondaryAttributesTerms];
		}, []);

	const sheetCode = React.useMemo(() => {
		return btoa(JSON.stringify(activeSheet));
	}, [activeSheet]);

	return (
		<>
			<Modal
				isOpen={shareModalOpen}
				setIsOpen={(open) => setShareModalOpen(!!open)}
				className={styles.shareModal}
			>
				<p>
					Copie o código abaixo no criador de ficha para importar essa ficha
				</p>
				<textarea
					id="sheetCodeField"
					title="Código ficha atual"
					value={sheetCode}
					disabled
				/>

				<Button onClick={copySheetCode}>
					<CopyOutlined /> Copiar
				</Button>
			</Modal>
			<header
				className={`${styles.sheetHeader} ${className || ""}`}
				style={{ ...style }}
			>
				<div className={styles.characterProfile}>
					<span className={styles.imgContainer}>
						{activeSheet?.imageURL && (!editMode || !!currentImgUrl) ? (
							<img
								alt="character image"
								src={editMode ? currentImgUrl : activeSheet.imageURL}
							/>
						) : (
							<UserOutlined />
						)}
						{editMode && (
							<Popover
								title="Edite URL imagem"
								content={() => (
									<span className={styles.popoverImgUrl}>
										<Input
											defaultValue={currentImgUrl || activeSheet?.imageURL}
											placeholder="Insira URL de imagem"
											onChange={(event) => {
												const {
													target: { value },
												} = event;

												setCurrentImgUrl(value || "");
											}}
										/>

										<span>
											<Button onClick={updateImgUrl}>&times;</Button>

											<Button
												onClick={() => {
													updateImgUrl(true);
												}}
											>
												<CheckOutlined />
											</Button>
										</span>
									</span>
								)}
								open={isImgEditPopoverOpen}
								onOpenChange={() => {
									setImgEditPopoverOpen(true);
								}}
							>
								<Button onClick={() => {}}>
									<EditOutlined />
								</Button>
							</Popover>
						)}
					</span>

					<h3 style={{ textAlign: "center" }}>
						{!editMode ? (
							activeSheet?.name || "Nome personagem"
						) : (
							<Input
								defaultValue={activeSheet?.name}
								placeholder="Nome personagem"
								style={{
									fontSize: "1.1rem",
								}}
								maxLength={24}
								onChange={updateName}
							/>
						)}
					</h3>

					<div className={styles.actionButtonsContainer}>
						{editMode ? (
							<>
								<Popconfirm
									className={styles.deleteBtn}
									title="Deletar ficha?"
									description="Essa ação não pode ser revertida"
									okText="Deletar"
									cancelText="Manter ficha"
									onConfirm={() => deleteSheet(activeSheet!)}
								>
									<DeleteOutlined />
								</Popconfirm>

								<Button
									className={styles.cancel}
									onClick={handleCancelEdits}
									rounded
								>
									<UndoOutlined />
								</Button>

								<Button
									className={styles.confirm}
									onClick={handleSaveEdits}
									rounded
								>
									<CheckOutlined />
								</Button>
							</>
						) : (
							<>
								<Button onClick={handleEnterEditMode} rounded>
									<EditOutlined />
								</Button>

								<Button onClick={openShareModal} rounded>
									<ShareAltOutlined />
								</Button>
							</>
						)}
					</div>
				</div>

				{attributesTermsList && (
					<div className={styles.attributes}>
						{Object.entries(attributesTermsList)?.map(([attrKey, attrName]) => (
							<span key={attrKey}>
								<span className={styles.attributeText}>
									<b>{attrName}</b>
								</span>
								{editMode ? (
									<Input
										type="tel"
										min={1}
										max={6}
										maxLength={1}
										pattern="[1-6]*"
										defaultValue={
											activeSheet?.attributes[attrKey as AttributeKey]
										}
										className={styles.attrInput}
										onChange={({ target }) => {
											if (!target.validity.valid) {
												target.value = "";
											} else {
												updateAttribute(
													attrKey as AttributeKey,
													Number(target.value)
												);
											}
										}}
									/>
								) : (
									<ButtonDice
										numSides={
											diceSideNumberFromLevel(
												activeSheet?.attributes[attrKey as AttributeKey] || 1
											) as DiceSides
										}
									>
										{activeSheet?.attributes[attrKey as AttributeKey]}
									</ButtonDice>
								)}
							</span>
						))}
					</div>
				)}

				{secondaryAttributesTermsList && (
					<div className={styles.secondaryAttributes}>
						{Object.entries(secondaryAttributesTermsList)?.map(
							([attrKey, attrName]) => {
								const attrValue =
									activeSheet?.secondaryAttributes[
										attrKey as SecondaryAttributeKey
									]?.current || 0;
								const attrLimit =
									activeSheet?.secondaryAttributes[
										attrKey as SecondaryAttributeKey
									]?.limit;
								const attrFinalLimit =
									activeSheet?.secondaryAttributes[
										attrKey as SecondaryAttributeKey
									]?.finalLimit;
								return (
									<span key={attrKey}>
										<b>{attrName}</b>
										<span
											className={`${styles.secondaryAttributesText} ${
												attrLimit && attrValue > attrLimit
													? styles.attrOverLimit
													: ""
											} ${
												attrFinalLimit && attrValue > attrFinalLimit
													? styles.attrOverFinalLimit
													: ""
											}`}
										>
											<p>
												{editMode && attrLimit ? (
													<Input
														type="tel"
														min={0}
														max={6}
														maxLength={1}
														className={styles.attrInput}
														onChange={({ target }) => {
															const rawValue = target?.value;
															const finalValue = onlyNumbers(rawValue);

															target.value = finalValue;

															updateSecondaryAttribute(
																attrKey as SecondaryAttributeKey,
																Number(finalValue)
															);
														}}
														defaultValue={attrValue}
													/>
												) : (
													attrValue
												)}
											</p>
											{!!attrLimit && (
												<p className={styles.maxValue}>
													{editMode ? (
														<Input
															title={`max value of ${attrName}`}
															type="tel"
															min={0}
															maxLength={2}
															className={styles.attrInput}
															defaultValue={attrLimit}
															onChange={(event) => {
																updateSecondaryAttributeLimit(
																	attrKey as SecondaryAttributeKey,
																	Number(event.target.value)
																);
															}}
														/>
													) : (
														attrLimit
													)}
												</p>
											)}
										</span>
									</span>
								);
							}
						)}
					</div>
				)}

				<div className={styles.generalStats}>
					<div className={styles.xpContainer}>
						<h4>XP</h4>
						<span
							className={
								Number(activeSheet?.xp.autoUsed) +
									Number(activeSheet?.xp.manualUsed) >
								Number(activeSheet?.xp.total)
									? styles.invalidXP
									: ""
							}
						>
							{editMode ? (
								<>
									<p>
										<span>{`${activeSheet?.xp.autoUsed} + `}</span>
										<Input
											type="tel"
											min={0}
											className={styles.xpInput}
											defaultValue={activeSheet?.xp.manualUsed}
											onChange={({ target }) => {
												const rawValue = target?.value;
												const finalValue = onlyNumbers(rawValue);

												target.value = finalValue;

												updateXP("manualUsed", Number(finalValue));
											}}
										/>
									</p>
									<p>|</p>
									<p>
										<Input
											type="tel"
											min={0}
											className={styles.xpInput}
											defaultValue={activeSheet?.xp.total}
											onChange={({ target }) => {
												const rawValue = target?.value;
												const finalValue = onlyNumbers(rawValue);

												target.value = finalValue;

												updateXP("total", Number(finalValue));
											}}
										/>
									</p>
								</>
							) : (
								<>
									<p>
										{Number(activeSheet?.xp.autoUsed) +
											Number(activeSheet?.xp.manualUsed)}
									</p>
									<p>|</p>
									<p>{activeSheet?.xp.total}</p>
								</>
							)}
						</span>
					</div>
					<div className={styles.bindingContainer}></div>
				</div>
			</header>
		</>
	);
};
