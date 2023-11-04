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
	const {
		data: { autoCalculations },
	} = useCharacterSheet();

	const skillsList = React.useMemo(() => {
		const list = Object.values(activeSheet?.skills || []);

		return list;
	}, [activeSheet]);

	const isAffinityOnLimit = React.useMemo(() => {
		if (!activeSheet) {
			return {};
		}

		const limit = {} as Record<string, boolean>;
		Object.keys(activeSheet.attributes).forEach((attributeKey) => {
			const threshold = activeSheet.attributes[attributeKey as AttributeKey];

			const affinityNumber = Object.values(activeSheet.skills).filter(
				(skill) => skill.hasAffinity && skill.linkedAttribute === attributeKey
			).length;

			limit[attributeKey] = threshold <= affinityNumber;
		});

		return limit;
	}, [activeSheet]);

	return (
		<section>
			<ul>
				{skillsList.map((skill) => {
					return (
						<li key={skill.id}>
							<SkillCard
								skill={skill}
								disableAffinity={
									!skill.hasAffinity && isAffinityOnLimit[skill.linkedAttribute]
								}
							/>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
