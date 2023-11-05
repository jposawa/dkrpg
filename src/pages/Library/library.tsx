import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import styles from "./library.module.scss";
import { Button, LibrarySheetContainer, ModuleModal } from "../../components";
import { useCharacterSheet } from "../../shared/hooks";
import { UserOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { characterSheetsListState } from "../../shared/state";

export const Library = () => {
	const [moduleModalOpen, setModuleModalOpen] = React.useState(false);
	const navigate = useNavigate();
	const { sheetId } = useParams();
  const characterSheetsList = useRecoilValue(characterSheetsListState);
	
	const handleNewCharacter = () => {
		setModuleModalOpen(true);
	};

	const openSheet = (sheetId: string) => {
		navigate(`/library/${sheetId}`);
	};

	return (
		<div className={styles.library}>
			<header>
				<h1 style={{ textAlign: "center" }}>Fichas</h1>
				<p>Aqui você pode encontrar a sua lista de fichas de personagens</p>
				<p className={styles.newButtonContainer}>
					<Button onClick={handleNewCharacter}>+</Button>
				</p>
			</header>

			<ModuleModal
				isOpen={moduleModalOpen}
				setIsOpen={(open) => setModuleModalOpen(!!open)}
			/>

			<ul className={styles.sheetList}>
				{characterSheetsList &&
					Object.values(characterSheetsList)?.map((characterSheet) => (
						<li
							onClick={() => {
								openSheet(characterSheet.id);
							}}
							key={characterSheet.id}
						>
							<span>
								{characterSheet.imageURL ? (
									<img
										alt="Mini imagem da personagem"
										src={characterSheet.imageURL}
									/>
								) : (
									<UserOutlined />
								)}
							</span>
							<h4>{characterSheet.name}</h4>
							<span>
								{`- ${characterSheet.module || "Draenak"} [${
									characterSheet.xp.total
								}xp]`}
							</span>
						</li>
					))}
			</ul>

			<LibrarySheetContainer sheetId={sheetId} />
		</div>
	);
};
