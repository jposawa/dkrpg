import { NAMESPACE } from "./constants";
import { atom } from "recoil";

export type Theme = "light" | "dark";

export const themeState = atom<Theme>({
  key: `${NAMESPACE}#theme`,
  default: "dark",
});
