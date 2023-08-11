import React from "react";

import styles from "./SheetHeader.module.scss";
import { CharacterSheet, DiceSides, SecondaryAttributeKey } from "../../shared/types";
import { ButtonDice } from "../ButtonDice/ButtonDice";
import { UserOutlined } from "@ant-design/icons";
import { termsList } from "../../shared/constants";
import { diceSideNumberFromLevel } from "../../shared/helpers/utils";

export type SheetHeaderProps = {
  activeSheet: CharacterSheet;
  className?: string;
  style?: React.CSSProperties;
};

export const SheetHeader = ({ activeSheet, className, style }: SheetHeaderProps) => {
  const [attributesTermsList, secondaryAttributesTermsList] = React.useMemo(() => {
    if (!activeSheet) {
      return [[], []];
    }
    const attributes = Object.keys(activeSheet.attributes);
    const secondaryAttributes = Object.keys(activeSheet.secondaryAttributes);
    const attributesTerms: { [key: string]: string } = {};
    const secondaryAttributesTerms: { [key: string]: string } = {};

    attributes.forEach((attributeKey) => {
      attributesTerms[attributeKey] = termsList[attributeKey];
    });

    secondaryAttributes.forEach((attributeKey) => {
      secondaryAttributesTerms[attributeKey] = termsList[attributeKey];
    });

    return [attributesTerms, secondaryAttributesTerms];
  }, []);

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
        {Object.entries(attributesTermsList).map(([attrKey, attrName], index) => (
          <span key={attrKey}>
            <span className={styles.attributeText}>
              <b>{attrName}</b>
            </span>
            <ButtonDice numSides={diceSideNumberFromLevel(index + 1) as DiceSides}>{index + 1}</ButtonDice>
          </span>
        ))}
      </div>

      <div className={styles.secondaryAttributes}>
        {Object.entries(secondaryAttributesTermsList).map(([attrKey, attrName]) => {
          return (
            <span key={attrKey}>
              <b>{attrName}</b>
              <span className={styles.secondaryAttributesText}>
                <p>
                  {activeSheet?.secondaryAttributes[attrKey as SecondaryAttributeKey]?.current}
                </p>
                {activeSheet?.secondaryAttributes[attrKey as SecondaryAttributeKey]?.limit && <p className={styles.maxValue}>{activeSheet.secondaryAttributes[attrKey as SecondaryAttributeKey].limit}</p>}
              </span>
            </span>
          )
        })}
      </div>
    </header>
  )
}