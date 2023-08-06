import React from "react";
import { useParams } from "react-router-dom";

import styles from "./library.module.scss";

export const Library = () => {
  const { sheetId } = useParams();

  // console.log(sheetId);
  return (
    <div>
      <h1>Library</h1>
    </div>
  )
}