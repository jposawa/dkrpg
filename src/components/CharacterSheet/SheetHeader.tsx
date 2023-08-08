import React from "react";

import styles from "./SheetHeader.module.scss";
import { Attribute, CharacterSheet, DiceSides } from "../../shared/types";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import { UserOutlined } from "@ant-design/icons";
import { attributesList } from "../../shared/constants";
import { diceSideNumberFromLevel } from "../../shared/helpers/utils";

export type SheetHeaderProps = {
  activeSheet: CharacterSheet;
  className?: string;
  style?: React.CSSProperties;
};

export const SheetHeader = ({ activeSheet, className, style }: SheetHeaderProps) => {

  return (
    <header
      className={`${styles.sheetHeader} ${className || ""}`}
      style={{ ...style }}
    >
      <div className={styles.characterProfile}>
        <span className={styles.imgContainer}>
          {activeSheet?.imageURL ? <img alt="character image" src={activeSheet.imageURL} /> : <UserOutlined />}
        </span>

        <h3>{activeSheet?.name || "Character Name"}</h3>
      </div>

      <div className={styles.attributes}>
        {Object.entries(attributesList).map(([attrKey, attrName]) => (
          <span key={attrKey}>
            <span className={styles.attributeText}>
              <b>{attrName}</b>
            </span>
            <ButtonDice numSides={diceSideNumberFromLevel(activeSheet.attributes[attrKey as Attribute]) as DiceSides}>{activeSheet.attributes[attrKey as Attribute]}</ButtonDice>
          </span>
        ))}
      </div>
    </header>
  )
}