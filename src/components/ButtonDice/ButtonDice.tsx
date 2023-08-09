import React from "react";

import D4img from "../../assets/img/D4.svg";
import D6img from "../../assets/img/D6.svg";
import D8img from "../../assets/img/D8.svg";
import D10img from "../../assets/img/D10.svg";
import D12img from "../../assets/img/D12.svg";
import D20img from "../../assets/img/D20.svg";

import styles from "./ButtonDice.module.scss";
import { diceSideNumberFromLevel, randomNumber } from "../../shared/helpers/utils";
import { useAntToast } from "../../shared/hooks";
import { DiceSides } from "../../shared/types";

export type ButtonDiceProps = {
  numSides: DiceSides;
  modifier?: number,
  onClick?: (e?: any) => void,
  className?: string,
  style?: React.CSSProperties,
  children?: string | React.ReactNode,
}

export const ButtonDice = ({
  numSides,
  modifier = 0,
  onClick,
  className,
  style,
  children
}: ButtonDiceProps) => {
  const { openToast } = useAntToast();
  const diceImg = {
    D4: D4img,
    D6: D6img,
    D8: D8img,
    D10: D10img,
    D12: D12img,
    D20: D20img,
  }

  const handleClick = onClick ? onClick : () => {
    const rollResult = randomNumber(1, numSides, true) + modifier;

    openToast(`Rolagem: ${rollResult}`, "", "open", "bottom");
  };

  return <button
    title="Dice button"
    type="button"
    onClick={handleClick}
    className={`${styles.button} ${className}`}
    style={{ ...style, backgroundImage: diceImg[`D${numSides}`] }}
  >
    <img alt="Image of a RPG dice" src={diceImg[`D${numSides}`]} />
    <span>{children}</span>
  </button>
}