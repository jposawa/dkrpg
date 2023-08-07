import React from "react";
import { useParams } from "react-router-dom";

import styles from "./library.module.scss";
import { LibrarySheetContainer } from "../../components";

export const Library = () => {
  const { sheetId } = useParams();

  console.log(sheetId);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Fichas</h1>
      <p>Aqui você pode encontrar a sua lista de fichas de personagens</p>

      <LibrarySheetContainer sheetId={sheetId} />
    </div>
  )
}