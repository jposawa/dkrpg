import { useRecoilValue } from "recoil";
import { themeState } from "./shared/state";

import { NavMenu } from "./components";
import { Routes } from "./pages";

import "./global.scss";
import styles from "./App.module.scss";

export default function App() {
  const activeTheme = useRecoilValue(themeState);

  return (
    <main
      id="mainContainer"
      className={`${styles.main} ${styles[activeTheme]}`}
    >
      <div id="diceContainer" />

      <Routes />

      <NavMenu />
    </main>
  )
}
