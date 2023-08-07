import React from "react";

import styles from "./CharacterSheet.module.scss";
import { SheetHeader } from ".";
import { DEBUG, characterSheetModel } from "../../shared/constants";

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
  const activeSheet = React.useMemo(() => {
    // if (!sheetId && DEBUG) {
    //   return characterSheetModel;
    // }
  }, [sheetId, DEBUG]);

  return (
    <div 
      className={`${styles.characterSheet} ${className || ""}`}
      style={{...style}}
    >
      <SheetHeader activeSheet={characterSheetModel} />
    </div>
  )
}