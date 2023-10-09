import React from "react";

import styles from "./SheetHeader.module.scss";
import {
	AttributeKey,
	CharacterSheet,
	DiceSides,
	SecondaryAttributeKey,
} from "../../shared/types";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
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
import { Button, Input } from "../";
import { useCharacterSheet } from "../../shared/hooks";
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
	const [isImgEditPopoverOpen, setImgEditPopoverOpen] = React.useState(false);
	const [currentImgUrl, setCurrentImgUrl] = React.useState(
		activeSheet?.imageURL
	);

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

		autoCalculations(cloneSheet);
		setActiveSheet(cloneSheet);
	};

	const updateSecondaryAttribute = (
		attrName: SecondaryAttributeKey,
		attrValue: number
	) => {
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.secondaryAttributes[attrName].current = attrValue;

		setActiveSheet(cloneSheet);
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

	return (
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
								onConfirm={() => deleteSheet(activeSheet!.id)}
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
						<Button onClick={handleEnterEditMode} rounded>
							<EditOutlined />
						</Button>
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
											<p className={styles.maxValue}>{attrLimit}</p>
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
          <h4>Pontos</h4>
          <p></p>
        </div>
        <div className={styles.bindingContainer}></div>
      </div>
		</header>
	);
};
