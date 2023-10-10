import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { termsList } from "../../shared/constants";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import {
	cloneObj,
	diceSideNumberFromLevel,
	onlyNumbers,
} from "../../shared/helpers/utils";
import { AttributeKey, CharacterSheet, DiceSides } from "../../shared/types";
import { Input } from "..";
import { useCharacterSheet } from "../../shared/hooks";

export const SheetSkills = () => {
	const [activeSheet] = useRecoilState(activeSheetState);
	const editMode = useRecoilValue(sheetEditingState);
	const {
		data: { autoCalculations },
	} = useCharacterSheet();

	const skillsList = React.useMemo(() => {
		const list = Object.values(activeSheet?.skills || []);

		return list;
	}, [activeSheet]);

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
		<section>
			<ul>
				{skillsList.map((skill) => {
					return (
						<li key={skill.id}>
							<b>
								[
								{termsList[skill.linkedAttribute].substring(0, 1).toUpperCase()}
								] {`${skill.name} `}
							</b>

							{editMode ? (
								<>
									<Input
										type="tel"
										min={0}
										max={6}
										maxLength={1}
										onChange={({ target }) => {
											const rawValue = target?.value;
											const finalValue = onlyNumbers(rawValue);

											target.value = finalValue;

											updateSkill(
												skill.id,
												Number(finalValue),
												skill.hasAffinity
											);
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
								</>
							) : (
								<ButtonDice
									numSides={
										diceSideNumberFromLevel(
											activeSheet?.attributes[
												skill.linkedAttribute as AttributeKey
											] || 1
										) as DiceSides
									}
									className="skillDice"
									modifier={skill.level}
								>
									{!!skill.level && `+${skill.level}`}
								</ButtonDice>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};
