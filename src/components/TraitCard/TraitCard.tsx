import { Popover } from "antd";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeSheetState, sheetEditingState } from "../../shared/state";
import { CharacterSheet, Trait } from "../../shared/types";
import { Input } from "../";

import styles from "./TraitCard.module.scss";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { cloneObj } from "../../shared/helpers/utils";
import { useCharacterSheet } from "../../shared/hooks";

export type TraitCardProps = {
  trait: Trait;
  className?: string;
  style?: React.CSSProperties;
};

export const TraitCard = ({ trait, className, style }: TraitCardProps) => {
  const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
  const editMode = useRecoilValue(sheetEditingState);
  const {
    data: { autoCalculations },
  } = useCharacterSheet();
  const detailsContent = (
    <span>
      <p>{trait.description}</p>
    </span>
  );

  const updateTrait = (traitId: string, finalLevel: number) => {
    const cloneSheet = cloneObj(activeSheet!) as CharacterSheet;
    const traitIndex = activeSheet?.traits.findIndex(
      (sheetTrait) => sheetTrait.id === traitId
    )!;

    console.table({
      traitId,
      traitIndex,
    })

    if (traitIndex < 0) {
      return;
    }

    const selectedTrait = cloneSheet.traits[traitIndex];
    const { level, cost } = selectedTrait;

    console.table({
      selectedTrait,
      level,
      cost,
      finalLevel,
    });

    if (level > 0) {
      cloneSheet.xp.autoUsed -= level * cost;
    }

    cloneSheet.xp.autoUsed += finalLevel * cost;

    cloneSheet.traits[traitIndex].level = finalLevel;

    setActiveSheet(cloneSheet);
  };

  return (
    <span
      className={`${styles.traitCard} ${className || ""}`}
      style={{ ...style } as React.CSSProperties}
    >
      <span className={styles.background} />
      <span>
        <Popover
          content={detailsContent}
          title={trait.name}
          className={styles.traitTitle}
          trigger="hover"
        >
          <QuestionCircleOutlined />
        </Popover>

        {trait.name}
      </span>

      {editMode && (
        <Input
          id={trait.id}
          type={!trait.maxLevel || trait.maxLevel === 1 ? "checkbox" : "tel"}
          min={0}
          max={trait.maxLevel}
          defaultValue={trait.level}
          defaultChecked={trait.level > 0}
          onChange={({ target: { type, checked, value } }) => {
            const finalLevel =
              type === "checkbox" ? 1 * Number(checked) : Number(value);

            updateTrait(trait.id, finalLevel);
          }}
        />
      )}
    </span>
  );
};
