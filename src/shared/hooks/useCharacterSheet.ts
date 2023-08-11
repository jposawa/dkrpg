import React from "react";
import { cloneObj, getLocalStorage, setLocalStorage } from "../helpers/utils";
import { CharacterSheet } from "../types";
import { v4 as uuidv4 } from "uuid";
import { characterSheetModel } from "../constants";

export const useCharacterSheet = () => {
  const characterSheetsList: CharacterSheet[] = React.useMemo(() => {
    const localList = getLocalStorage("characterSheetsList", true);

    return localList || [];
  }, [getLocalStorage]);

  const getActiveCharacter = React.useCallback((characterId: string) => {
    if (!characterSheetsList) {
      return null;
    }
  
    const [activeSheet] = characterSheetsList?.filter((character: CharacterSheet) => character.id === characterId)

    return activeSheet;
  }, [characterSheetsList]);

  
  const saveCharacterSheet = React.useCallback((sheet: CharacterSheet) => {
    const sheetIndex = characterSheetsList?.findIndex((characterSheet) => characterSheet.id === sheet.id);
    
    if (sheetIndex < 0) {
      characterSheetsList.push(sheet);
    } else {
      characterSheetsList[sheetIndex] = sheet;
    }
    
    setLocalStorage("characterSheetsList", characterSheetsList, true);
  }, [characterSheetsList]);
  
  const getNewCharacterSheet = React.useCallback(():CharacterSheet => {
    const newObj = cloneObj(characterSheetModel) as CharacterSheet;

    newObj.id = uuidv4();
    newObj.name = "Nome Personagem";

    saveCharacterSheet(newObj);

    return newObj;
  }, [saveCharacterSheet]);
  
  return React.useMemo(() => ({
    data: {
      characterSheetsList,
      getActiveCharacter,
      getNewCharacterSheet,
      saveCharacterSheet,
    },
  }), [
    characterSheetsList,
    getActiveCharacter,
    getNewCharacterSheet,
    saveCharacterSheet,
  ]);
};