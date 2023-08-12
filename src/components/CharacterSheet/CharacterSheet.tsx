import React from "react";

import styles from "./CharacterSheet.module.scss";
import { SheetHeader } from ".";
import { DEBUG, characterSheetModel } from "../../shared/constants";
import { useCharacterSheet } from "../../shared/hooks";
import { CharacterSheet as CharacterSheetType } from "../../shared/types";
import { useRecoilState } from "recoil";
import { activeSheetState } from "../../shared/state";

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
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  React.useEffect(() => {
    if ((!sheetId && DEBUG) || sheetId === "model") {
      setActiveSheet(characterSheetModel);
    }

    setActiveSheet(getActiveCharacter(sheetId));
  }, [sheetId, DEBUG]);

  return (
    <div
      className={`${styles.characterSheet} ${className || ""}`}
      style={{ ...style }}
    >
      {!activeSheet ? <h4>Falha ao carregar ficha</h4> : (
        <SheetHeader />
      )}
    </div>
  )
}