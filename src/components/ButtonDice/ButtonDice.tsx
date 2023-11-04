import React from "react";

import D4img from "../../assets/img/D4.svg";
import D6img from "../../assets/img/D6.svg";
import D8img from "../../assets/img/D8.svg";
import D10img from "../../assets/img/D10.svg";
import D12img from "../../assets/img/D12.svg";
import D20img from "../../assets/img/D20.svg";

import { useAntToast } from "../../shared/hooks";
import { Dice } from "./Dice";
import { DiceSides } from "../../shared/types";

import styles from "./ButtonDice.module.scss";
import { useRecoilState } from "recoil";
import { rollingState } from "../../shared/state";

export type ButtonDiceProps = {
	numSides: DiceSides;
	modifier?: number;
	onClick?: (e?: any) => void;
	className?: string;
	style?: React.CSSProperties;
	children?: string | React.ReactNode;
	clearTimeout?: number;
};

Dice.init();

export const ButtonDice = ({
	numSides,
	modifier = 0,
	onClick,
	className,
	style,
	children,
}: ButtonDiceProps) => {
	const { openToast } = useAntToast();
	const diceImg = {
		D4: D4img,
		D6: D6img,
		D8: D8img,
		D10: D10img,
		D12: D12img,
		D20: D20img,
	};
	const [isRolling, setIsRolling] = useRecoilState(rollingState);

	const clearDice = () => {
		Dice.clear();
		setIsRolling(false);
	};

	Dice.onRollComplete = (result: any) => {
		console.log(result);
		const diceNatResult = result[0].rolls[0].value;
		const modifier = result[0].modifier;
		openToast(
			`Resultado: ${result[0].value}`,
			`${!!modifier ? `[${diceNatResult}] + ${modifier}` : ""}`,
			"open",
			"bottom",
			undefined,
			clearDice
		);
	};

	const roll3D = () => {
		if (isRolling) {
			return;
		}

		setIsRolling(true);
		if (!!modifier) {
			Dice.roll(`1d${numSides}+${modifier}`);
		} else {
			Dice.roll(`1d${numSides}`);
		}
	};

	const handleClick = onClick ? onClick : roll3D;

	return (
		<button
			title="Dice button"
			type="button"
			onClick={handleClick}
			className={`${styles.button} ${className}`}
			style={{ ...style, backgroundImage: diceImg[`D${numSides}`] }}
			disabled={isRolling}
		>
			<img alt="Image of a RPG dice" src={diceImg[`D${numSides}`]} />
			<span>{children}</span>
		</button>
	);
};
