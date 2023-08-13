import React from "react";

import styles from "./LibrarySheetContainer.module.scss";
import { SheetTypes } from "../../shared/types";
import { Button, CharacterSheet } from "../";
import { DEBUG } from "../../shared/constants";
import { useNavigate } from "react-router-dom";

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
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleCloseSheet = () => {
    setIsSheetOpen(false);

    setTimeout(() => {
      navigate("/library");
    }, 350);
  };

  React.useEffect(() => {
    if (!!sheetId || DEBUG) {
      setIsSheetOpen(true);
    } else if (isSheetOpen) {
      handleCloseSheet();
    }
  }, [sheetId]);

  return (
    <div
      className={`
        ${styles.sheetContainer} 
        ${!isSheetOpen ? styles.hideContainer : ""}
      `}
    >
      <span className={styles.background} />
      <Button type="button" onClick={handleCloseSheet} className={styles.closeBtn}>&times;</Button>
      {(sheetId || DEBUG) && <CharacterSheet sheetId={sheetId || "model"} />}
    </div>
  )
}