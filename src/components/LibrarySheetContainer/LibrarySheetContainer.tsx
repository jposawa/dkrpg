import React from "react";

import styles from "./LibrarySheetContainer.module.scss";
import { SheetTypes } from "../../shared/types";
import { CharacterSheet } from "../";

export type LibrarySheetContainerProps = {
  sheetId: string | null | undefined,
  sheetType?: SheetTypes,
  className?: string,
  style?: React.CSSProperties,
}

export const LibrarySheetContainer = ({
  sheetId,
  sheetType = "character",
  className,
  style,
}: LibrarySheetContainerProps) => {
  const [activeSheet, setActiveSheet] = React.useState<string>("");

  React.useEffect(() => {
    if (sheetId) {
      setActiveSheet(sheetId);
    }
  }, [sheetId]);

  return (
    <div
      className={`
        ${styles.sheetContainer} 
        ${!sheetId ? styles.hideContainer : ""}
      `}
    >
      {sheetId && {
        "character": <CharacterSheet sheetId={activeSheet} />
      }[sheetType]}
    </div>
  )
}