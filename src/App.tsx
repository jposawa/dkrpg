
import "./global.scss";
import { useRecoilValue } from "recoil";
import { themeState } from "./shared/state";

import styles from "./App.module.scss";
import { NavMenu } from "./components";
import { Routes } from "./pages";

export default function App() {
  const activeTheme = useRecoilValue(themeState);

  return (
    <main className={`${styles.main} ${styles[activeTheme]}`}>
      <Routes />
      <NavMenu />
    </main>
  )
}