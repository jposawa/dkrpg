import React from "react";

import styles from "./LibrarySheetContainer.module.scss";
import { SheetTypes } from "../../shared/types";
import { CharacterSheet } from "../";
import { DEBUG } from "../../shared/constants";
import { Link } from "react-router-dom";

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
    if (sheetId || DEBUG) {
      setActiveSheet(sheetId || "debugSheet");
    }
  }, [sheetId]);

  return (
    <div
      className={`
        ${styles.sheetContainer} 
        ${!sheetId && !DEBUG ? styles.hideContainer : ""}
      `}
    >
      <span className={styles.background} />
      <Link to="/library" className={styles.closeBtn}>&times;</Link>
      {sheetId || DEBUG && <CharacterSheet sheetId={activeSheet} />}
    </div>
  )
}