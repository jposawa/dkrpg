import React from "react";

import styles from "./CharacterSheet.module.scss";
import { SheetHeader } from ".";
import { DEBUG, characterSheetModel } from "../../shared/constants";
import { useCharacterSheet } from "../../shared/hooks";
import { CharacterSheet as CharacterSheetType } from "../../shared/types";
import { useRecoilState } from "recoil";
import { activeSheetState } from "../../shared/state";
import { Tabs } from "antd";
import { SheetTraits } from "./SheetTraits";
import { SheetSkills } from "./SheetSkills";
import { SheetInventory } from "./SheetInventory";
import { Loading } from "../Loading";

export type CharacterSheetProps = {
	sheetId: string;
	className?: string;
	style?: React.CSSProperties;
};

export const CharacterSheet = ({
	sheetId,
	className,
	style,
}: CharacterSheetProps) => {
	const {
		data: { getActiveCharacter },
	} = useCharacterSheet();
	const [activeSheet, setActiveSheet] = useRecoilState(activeSheetState);
	const [refetchCount, setRefetchCount] = React.useState(0);

	React.useEffect(() => {
		if ((!sheetId && DEBUG) || sheetId === "model") {
			setActiveSheet(characterSheetModel);
		}

		if (sheetId !== activeSheet?.id) {
			const chosenSheet = getActiveCharacter(sheetId);

			if (!chosenSheet && refetchCount < 3) {
				setTimeout(() => {
					setRefetchCount(refetchCount + 1);
				}, 500);
			}

			setActiveSheet(chosenSheet);
		}
	}, [sheetId, DEBUG, refetchCount]);

	const bodySections = [
		{
			label: "Traços",
			key: "1",
			children: <SheetTraits />,
		},
		{
			label: "Competências",
			key: "2",
			children: <SheetSkills />,
		},
		{
			label: "Inventário",
			key: "3",
			children: <SheetInventory />,
		},
	];

	return (
		<div
			className={`${styles.characterSheet} ${className || ""}`}
			style={{ ...style }}
		>
			{!activeSheet ? (
				<h4>{refetchCount < 3 ? <Loading /> : "Falha ao carregar ficha"}</h4>
			) : (
				<>
					<SheetHeader />
					<Tabs
						defaultActiveKey="2"
						centered
						items={bodySections}
						className={styles.sheetBodyTabs}
						destroyInactiveTabPane
					/>
				</>
			)}
		</div>
	);
};
