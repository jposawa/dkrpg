import { Popover } from "antd";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import {
	AttributeKey,
	CharacterSheet,
	DiceSides,
	Skill,
} from "../../shared/types";
import { ButtonDice, FeatureCard, Input } from "..";

import { QuestionCircleOutlined } from "@ant-design/icons";
import {
	cloneObj,
	diceSideNumberFromLevel,
	onlyNumbers,
} from "../../shared/helpers/utils";
import { useCharacterSheet } from "../../shared/hooks";

import styles from "./SkillCard.module.scss";
import { termsList, AFFINITY_BONUS } from "../../shared/constants";

export type SkillCardProps = {
	skill: Skill;
	className?: string;
	style?: React.CSSProperties;
};

export const SkillCard = ({ skill, className, style }: SkillCardProps) => {
	const activeSheet = useRecoilValue(activeSheetState);
	const editMode = useRecoilValue(sheetEditingState);
	const {
		data: { autoCalculations },
	} = useCharacterSheet();
	const detailsContent = (
		<span>
			<p>{skill.description}</p>
		</span>
	);

	const updateSkill = (
		skillId: string,
		skillValue: number,
		hasAffinity = false
	) => {
		const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;

		cloneSheet.skills[skillId].level = skillValue;
		cloneSheet.skills[skillId].hasAffinity = hasAffinity;

		autoCalculations(cloneSheet, true);
	};

	return (
		<FeatureCard
			className={`${styles.skillCard} ${className}`}
			style={{ ...style } as React.CSSProperties}
		>
			<span className={styles.skillTitle}>
				{!!skill.description && (
					<Popover
						content={detailsContent}
						title={skill.description}
						trigger="hover"
					>
						<QuestionCircleOutlined />
					</Popover>
				)}

				<b>
					[{termsList[skill.linkedAttribute].substring(0, 1).toUpperCase()}]
				</b>
				{`${skill.name} `}
			</span>

			{editMode ? (
				<span className={styles.inputsContainer}>
					<Input
						type="tel"
						min={0}
						max={6}
						maxLength={1}
						onChange={({ target }) => {
							const rawValue = target?.value;
							const finalValue = onlyNumbers(rawValue);

							target.value = finalValue;

							updateSkill(skill.id, Number(finalValue), skill.hasAffinity);
						}}
						defaultValue={skill.level}
					/>

					<Input
						type="checkbox"
						defaultChecked={skill.hasAffinity}
						onChange={({ target: { checked } }) => {
							updateSkill(skill.id, skill.level, checked);
						}}
					/>
				</span>
			) : (
				<ButtonDice
					numSides={
						diceSideNumberFromLevel(
							activeSheet?.attributes[skill.linkedAttribute as AttributeKey] ||
								1
						) as DiceSides
					}
					className={skill.hasAffinity ? styles.hasAffinity : ""}
					modifier={skill.level + (skill.hasAffinity ? AFFINITY_BONUS : 0)}
				>
					{(!!skill.level || skill.hasAffinity) &&
						`+${skill.level + (skill.hasAffinity ? AFFINITY_BONUS : 0)}`}
				</ButtonDice>
			)}
		</FeatureCard>
	);
};
