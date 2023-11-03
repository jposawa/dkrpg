import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { AFFINITY_BONUS, termsList } from "../../shared/constants";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import {
	cloneObj,
	diceSideNumberFromLevel,
	onlyNumbers,
} from "../../shared/helpers/utils";
import { AttributeKey, CharacterSheet, DiceSides } from "../../shared/types";
import { Input, SkillCard } from "..";
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
							<SkillCard
                skill={skill}
              />
						</li>
					);
				})}
			</ul>
		</section>
	);
};
