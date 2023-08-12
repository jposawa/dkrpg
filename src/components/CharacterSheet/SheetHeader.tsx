import React from "react";

import styles from "./SheetHeader.module.scss";
import {
	CharacterSheet,
	DiceSides,
	SecondaryAttributeKey,
} from "../../shared/types";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import {
	CheckOutlined,
	EditOutlined,
	UndoOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { termsList } from "../../shared/constants";
import {
	cloneObj,
	diceSideNumberFromLevel,
	getSessionStorage,
	setSessionStorage,
	withNamespace,
} from "../../shared/helpers/utils";
import { useRecoilState } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { Button, Input } from "../";
import { useCharacterSheet } from "../../shared/hooks";
import { Popover } from "antd";

export type SheetHeaderProps = {
	className?: string;
	style?: React.CSSProperties;
};

export const SheetHeader = ({ className, style }: SheetHeaderProps) => {
	const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
	const [editMode, setEditMode] = useRecoilState(sheetEditingState);
	const {
		data: { updateEditingSheet, saveCharacterSheet },
	} = useCharacterSheet();
	const [isImgEditPopoverOpen, setImgEditPopoverOpen] = React.useState(false);
	const [currentImgUrl, setCurrentImgUrl] = React.useState();

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
					{activeSheet?.imageURL ? (
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

				<h3>{activeSheet?.name || "Character Name"}</h3>

				<div className={styles.actionButtonsContainer}>
					{editMode ? (
						<>
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

			<div className={styles.attributes}>
				{Object.entries(attributesTermsList).map(
					([attrKey, attrName], index) => (
						<span key={attrKey}>
							<span className={styles.attributeText}>
								<b>{attrName}</b>
							</span>
							<ButtonDice
								numSides={diceSideNumberFromLevel(index + 1) as DiceSides}
							>
								{index + 1}
							</ButtonDice>
						</span>
					)
				)}
			</div>

			<div className={styles.secondaryAttributes}>
				{Object.entries(secondaryAttributesTermsList).map(
					([attrKey, attrName]) => {
						return (
							<span key={attrKey}>
								<b>{attrName}</b>
								<span className={styles.secondaryAttributesText}>
									<p>
										{
											activeSheet?.secondaryAttributes[
												attrKey as SecondaryAttributeKey
											]?.current
										}
									</p>
									{activeSheet?.secondaryAttributes[
										attrKey as SecondaryAttributeKey
									]?.limit && (
										<p className={styles.maxValue}>
											{
												activeSheet.secondaryAttributes[
													attrKey as SecondaryAttributeKey
												].limit
											}
										</p>
									)}
								</span>
							</span>
						);
					}
				)}
			</div>
		</header>
	);
};
