import React from "react";
import {
	cloneObj,
	getLocalStorage,
	isObjEqual,
	setLocalStorage,
	setSessionStorage,
	withNamespace,
} from "../helpers/utils";
import {
	AttributeKey,
	CharacterSheet,
	ModuleOptions,
	SecondaryAttributeKey,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import {
	BASE_COST,
	IMPORT_AUTOCLOSE,
	MODULE_DATA,
	characterSheetModel,
} from "../constants";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeSheetState,
	characterSheetsListState,
	fbUserState,
	sheetEditingState,
} from "../state";
import { useAntToast } from "./useAntToast";
import { useNavigate } from "react-router-dom";
import {
	getModuleData,
	getSheetList,
	removeDbCharacter,
	saveDbCharacter,
} from "../../services";

export const useCharacterSheet = () => {
	const navigate = useNavigate();
	const setActiveSheet = useSetRecoilState(activeSheetState);
	const setEditMode = useSetRecoilState(sheetEditingState);
	const { openToast } = useAntToast();
	// const localList = getLocalStorage("characterSheetsList", true);
	const [characterSheetsList, setCharacterSheetsList] = useRecoilState(
		characterSheetsListState
	);
	const fbUser = useRecoilValue(fbUserState);

	const getActiveCharacter = React.useCallback(
		(characterId: string, isRetry?: boolean) => {
			if (!Object.keys(characterSheetsList).length) {
				return null;
			}

			return characterSheetsList[characterId];
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

					sheet.xp.autoUsed +=
						(attrValue.limitBonus || 0) * BASE_COST.SECONDARY_ATTRIBUTE;
				}
			}
		);

		Object.values(sheet.attributes).forEach((attrLvl) => {
			let attrCost = 0;

			while (attrLvl > 1) {
				attrCost += BASE_COST.ATTRIBUTE * attrLvl--;
			}

			sheet.xp.autoUsed += attrCost;
		});

		Object.values(sheet.skills).forEach((skill) => {
			let [skillLevelCounter, skillCost] = [skill.level, 0];

			while (skillLevelCounter > 0) {
				skillCost += BASE_COST.SKILL * skillLevelCounter--;
			}

			sheet.xp.autoUsed += skillCost;
		});

		Object.values(sheet.traits).forEach((trait) => {
			const { level, cost } = trait;

			sheet.xp.autoUsed += level * cost;
		});

		if (updateState) {
			setActiveSheet(sheet);
		}
	};

	const saveCharacterSheet = React.useCallback(
		(sheet: CharacterSheet, options: SaveOptions = {}) => {
			try {
				const cloneSheet = cloneObj(sheet) as CharacterSheet;
				autoCalculations(cloneSheet);

				if (!cloneSheet.userId) {
					cloneSheet.userId = fbUser.uid;
				}

				const { keepSessionSheet, preventAlert } = options;

				if (!keepSessionSheet) {
					sessionStorage.removeItem(withNamespace("editingSheet"));
					sessionStorage.removeItem(withNamespace("backupActiveSheet"));
				}

				saveDbCharacter(cloneSheet);

				if (!preventAlert) {
					openToast("Ficha salva com sucesso", "", "success");
				}

				setEditMode(false);
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

	const getNewCharacterSheet = React.useCallback(
		(sheetModule: ModuleOptions = "draenak") => {
			const newObj = cloneObj(characterSheetModel) as CharacterSheet;
			getModuleData(sheetModule, (moduleData: any) => {
				newObj.id = uuidv4();
				newObj.name = "Nome Personagem";

				newObj.module = sheetModule;
				newObj.race = moduleData.races["race-1"];
				newObj.skills = moduleData.skills;
				newObj.traits = moduleData.traits;

				saveCharacterSheet(newObj, { preventAlert: true });
				setActiveSheet(newObj);
			});

			// return newObj;
		},
		[saveCharacterSheet]
	);

	const deleteSheet = (sheet: CharacterSheet) => {
		try {
			removeDbCharacter(sheet.userId!, sheet.id);
			setActiveSheet(null);
			setEditMode(false);
			navigate("/library");
			openToast("Ficha deletada com sucesso", "", "info");
		} catch (error) {
			console.error("Error on removing", error);
			openToast("Erro ao remover ficha", "Contate dev");
		}
	};

	const importSheet = React.useCallback(
		(sheetCode: string, textElement?: HTMLTextAreaElement) => {
			try {
				const stringSheet = atob(sheetCode);
				const importedSheet = JSON.parse(stringSheet);
				let saveSheet = true;

				const existingSheet = characterSheetsList[importedSheet.id];

				if (!!existingSheet) {
					saveSheet = window.confirm(
						"Uma ficha da mesma personagem foi encontrada. Deseja substituir por essa importada? (Operação não pode ser desfeita)"
					);
				}

				if (saveSheet) {
					saveCharacterSheet(importedSheet);
				}

				if (!!textElement) {
					textElement.value = "";
				}

				return IMPORT_AUTOCLOSE;
			} catch (error) {
				console.error("Error on importing sheet", error);
				openToast("Falha ao importar ficha", "Verifique o código fornecido");

				return false;
			}
		},
		[characterSheetsList, setCharacterSheetsList]
	);

	React.useEffect(() => {
		if (!!fbUser) {
			getSheetList(fbUser.uid, setCharacterSheetsList);
		}
	}, [fbUser]);

	return React.useMemo(
		() => ({
			data: {
				getActiveCharacter,
				getNewCharacterSheet,
				saveCharacterSheet,
				updateEditingSheet,
				deleteSheet,
				autoCalculations,
				importSheet,
			},
		}),
		[
			getActiveCharacter,
			getNewCharacterSheet,
			saveCharacterSheet,
			updateEditingSheet,
			deleteSheet,
			autoCalculations,
			importSheet,
		]
	);
};
