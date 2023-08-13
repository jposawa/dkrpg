import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import styles from "./library.module.scss";
import { Button, LibrarySheetContainer } from "../../components";
import { useCharacterSheet } from "../../shared/hooks";
import { UserOutlined } from "@ant-design/icons";

export const Library = () => {
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const {
    data: { getNewCharacterSheet, characterSheetsList },
  } = useCharacterSheet();

  const handleNewCharacterSheet = () => {
    const newSheet = getNewCharacterSheet();
    navigate(`/library/${newSheet.id}`);
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
          <Button onClick={handleNewCharacterSheet}>+</Button>
        </p>
      </header>

      <ul className={styles.sheetList}>
        {characterSheetsList && characterSheetsList?.map((characterSheet) => (
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
              {`- ${characterSheet.race.name} [${characterSheet.xp.total}xp]`}
            </span>
          </li>
        ))}
      </ul>

      <LibrarySheetContainer sheetId={sheetId} />
    </div>
  );
};
