import React from "react";
import {
	cloneObj,
	getLocalStorage,
	setLocalStorage,
	setSessionStorage,
	withNamespace,
} from "../helpers/utils";
import { CharacterSheet } from "../types";
import { v4 as uuidv4 } from "uuid";
import { characterSheetModel } from "../constants";
import { useSetRecoilState } from "recoil";
import { activeSheetState, sheetEditingState } from "../state";
import { useAntToast } from "./useAntToast";

export const useCharacterSheet = () => {
	const setActiveSheet = useSetRecoilState(activeSheetState);
  const setEditMode = useSetRecoilState(sheetEditingState);
	const { openToast } = useAntToast();
	const characterSheetsList: CharacterSheet[] = React.useMemo(() => {
		const localList = getLocalStorage("characterSheetsList", true);

		return localList || [];
	}, [getLocalStorage]);

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

	const saveCharacterSheet = React.useCallback(
		(sheet: CharacterSheet, keepSessionSheet = false) => {
			try {
				const sheetIndex = characterSheetsList?.findIndex(
					(characterSheet) => characterSheet.id === sheet.id
				);

				if (sheetIndex < 0) {
					characterSheetsList.push(sheet);
				} else {
					characterSheetsList[sheetIndex] = sheet;
				}

				if (!keepSessionSheet) {
					sessionStorage.removeItem(withNamespace("editingSheet"));
          sessionStorage.removeItem(withNamespace("backupActiveSheet"));
				}

				setLocalStorage("characterSheetsList", characterSheetsList, true);

        setEditMode(false);
				openToast("Ficha salva com sucesso", "", "success");
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

		saveCharacterSheet(newObj);

		return newObj;
	}, [saveCharacterSheet]);

	return React.useMemo(
		() => ({
			data: {
				characterSheetsList,
				getActiveCharacter,
				getNewCharacterSheet,
				saveCharacterSheet,
				updateEditingSheet,
			},
		}),
		[
			characterSheetsList,
			getActiveCharacter,
			getNewCharacterSheet,
			saveCharacterSheet,
			updateEditingSheet,
		]
	);
};
