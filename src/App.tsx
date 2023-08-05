
import "./global.scss";
import styles from "./App.module.scss";
import { useRecoilValue } from "recoil";
import { themeState } from "./shared/state";

export default function App() {
  const activeTheme = useRecoilValue(themeState);

  return (
    <main className={`${styles.main} ${styles[activeTheme]}`}>
      React ⚛️ + Vite ⚡ + Replit 🌀
    </main>
  )
}