import React from "react";
import {
	cloneObj,
	getLocalStorage,
	isObjEqual,
	setLocalStorage,
	setSessionStorage,
	withNamespace,
} from "../helpers/utils";
import { AttributeKey, CharacterSheet, SecondaryAttributeKey } from "../types";
import { v4 as uuidv4 } from "uuid";
import { BASE_COST, characterSheetModel } from "../constants";
import { useSetRecoilState } from "recoil";
import { activeSheetState, sheetEditingState } from "../state";
import { useAntToast } from "./useAntToast";
import { useNavigate } from "react-router-dom";

export const useCharacterSheet = () => {
	const navigate = useNavigate();
	const setActiveSheet = useSetRecoilState(activeSheetState);
	const setEditMode = useSetRecoilState(sheetEditingState);
	const { openToast } = useAntToast();
	const localList = getLocalStorage("characterSheetsList", true);
	const [characterSheetsList, setCharacterSheetsList] = React.useState<
		CharacterSheet[]
	>([]);

	const getActiveCharacter = React.useCallback(
		(characterId: string) => {
			if (!characterSheetsList) {
				return null;
			}

			const [activeSheet] = characterSheetsList?.filter(
				(character: CharacterSheet) => character.id === characterId
			);

			return activeSheet;
		},
		[characterSheetsList]
	);

	type SaveOptions = {
		keepSessionSheet?: boolean;
		preventAlert?: boolean;
	};

	const autoCalculations = (sheet: CharacterSheet, updateState = false) => {
		sheet.secondaryAttributes.capacity.limit = 8 + sheet.attributes.fortitude;
		sheet.secondaryAttributes.resistance.current = sheet.attributes.fortitude;
		sheet.secondaryAttributes.stress.limit = 10 + sheet.attributes.willpower;
		sheet.secondaryAttributes.wound.limit = 10 + sheet.attributes.fortitude;

    sheet.xp.autoUsed = 0;

		Object.entries(sheet.secondaryAttributes).forEach(
			([attrKey, attrValue]) => {
				if (!!attrValue.limit) {
					const limitWithBonus = attrValue.limit + (attrValue.limitBonus || 0);

					sheet.secondaryAttributes[
						attrKey as SecondaryAttributeKey
					].finalLimit = limitWithBonus * (attrValue.finalMultiplier || 1);
				}
			}
		);

		Object.values(sheet.attributes).forEach((attrLvl) => {
			let attrCost = 0;

      while(attrLvl > 1) {
        attrCost += BASE_COST.ATTRIBUTE * attrLvl--;
      }

      sheet.xp.autoUsed += attrCost;
		});

    Object.values(sheet.skills).forEach((skill) => {
      let [skillLevelCounter, skillCost] = [skill.level, 0];

      while (skillLevelCounter > 0) {
        skillCost += BASE_COST.SKILL * skillLevelCounter--;
      }

      skillCost /= skill.hasAffinity ? 2 : 1;

      sheet.xp.autoUsed += skillCost;
    })

		if (updateState) {
			setActiveSheet(sheet);
		}
	};

	const saveCharacterSheet = React.useCallback(
		(sheet: CharacterSheet, options: SaveOptions = {}) => {
			try {
				const cloneSheet = cloneObj(sheet) as CharacterSheet;
				autoCalculations(cloneSheet);

				const { keepSessionSheet, preventAlert } = options;
				const sheetIndex = characterSheetsList?.findIndex(
					(characterSheet) => characterSheet.id === cloneSheet.id
				);

				if (sheetIndex < 0) {
					characterSheetsList.push(cloneSheet);
				} else {
					characterSheetsList[sheetIndex] = cloneSheet;
				}

				if (!keepSessionSheet) {
					sessionStorage.removeItem(withNamespace("editingSheet"));
					sessionStorage.removeItem(withNamespace("backupActiveSheet"));
				}

				setActiveSheet(cloneSheet);
				setLocalStorage("characterSheetsList", characterSheetsList, true);

				setEditMode(false);

				if (!preventAlert) {
					openToast("Ficha salva com sucesso", "", "success");
				}
			} catch (error) {
				console.error("Erro em salvar ficha", error);
				openToast(
					"Falha em salvar ficha",
					"Revise os dados e tente novamente",
					"error"
				);
			}
		},
		[characterSheetsList]
	);

	const updateEditingSheet = React.useCallback(
		(characterSheet: CharacterSheet) => {
			try {
				const cloneSheet = cloneObj(characterSheet) as CharacterSheet; //Probably unecessary, but just to be sure...

				setActiveSheet(cloneSheet);
				setSessionStorage("editingSheet", cloneSheet, true);
			} catch (error) {
				console.error("Erro em atualizar dados de cache da ficha", error);
			}
		},
		[setActiveSheet, setSessionStorage]
	);

	const getNewCharacterSheet = React.useCallback((): CharacterSheet => {
		const newObj = cloneObj(characterSheetModel) as CharacterSheet;

		newObj.id = uuidv4();
		newObj.name = "Nome Personagem";

		saveCharacterSheet(newObj, { preventAlert: true });

		return newObj;
	}, [saveCharacterSheet]);

	const deleteSheet = (sheetId: string) => {
		const cloneList = cloneObj(characterSheetsList) as CharacterSheet[];
		const sheetIndex = cloneList.findIndex((item) => item.id === sheetId);

		cloneList.splice(sheetIndex, 1);

		setLocalStorage("characterSheetsList", cloneList, true);
		setActiveSheet(null);
		setEditMode(false);
		navigate("/library");
		openToast("Ficha deletada com sucesso", "", "info");
	};

	React.useMemo(() => {
		if (!isObjEqual(localList, characterSheetsList)) {
			setCharacterSheetsList(localList || []);
		}
	}, [localList]);

	return React.useMemo(
		() => ({
			data: {
				characterSheetsList,
				getActiveCharacter,
				getNewCharacterSheet,
				saveCharacterSheet,
				updateEditingSheet,
				deleteSheet,
				autoCalculations,
			},
		}),
		[
			characterSheetsList,
			getActiveCharacter,
			getNewCharacterSheet,
			saveCharacterSheet,
			updateEditingSheet,
			deleteSheet,
			autoCalculations,
		]
	);
};
