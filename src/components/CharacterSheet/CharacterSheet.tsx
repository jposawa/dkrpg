import React from "react";

import styles from "./CharacterSheet.module.scss";
import { SheetHeader } from ".";
import { DEBUG, characterSheetModel } from "../../shared/constants";
import { useCharacterSheet } from "../../shared/hooks";
import { CharacterSheet as CharacterSheetType } from "../../shared/types";

export type CharacterSheetProps = {
  sheetId: string,
  className?: string,
  style?: React.CSSProperties,
}

export const CharacterSheet = ({
  sheetId,
  className,
  style,
}: CharacterSheetProps) => {
  const { data: { getActiveCharacter } } = useCharacterSheet();
  const activeSheet = React.useMemo(() => {
    if ((!sheetId && DEBUG) || sheetId === "model") {
      return characterSheetModel;
    }

    return getActiveCharacter(sheetId);
  }, [sheetId, DEBUG]);

  return (
    <div
      className={`${styles.characterSheet} ${className || ""}`}
      style={{ ...style }}
    >
      {!activeSheet ? <h4>Falha ao carregar ficha</h4> : (
        <SheetHeader activeSheet={activeSheet as CharacterSheetType} />
      )}
    </div>
  )
}