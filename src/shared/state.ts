import { NAMESPACE } from "./constants";
import { atom } from "recoil";
import { withNamespace } from "./helpers/utils";
import { CharacterSheet, ModuleOptions } from "./types";

export type Theme = "light" | "dark";

export const themeState = atom<Theme>({
  key: withNamespace("theme"),
  default: "dark",
});

export const sheetEditingState = atom<boolean>({
  key: withNamespace("sheetEditing"),
  default: false,
});

export const activeModuleState = atom<ModuleOptions>({
  key: withNamespace("activeModule"),
  default: "draenak",
});

export const activeSheetState = atom<CharacterSheet | null>({
  key: withNamespace("activeSheet"),
  default: null,
});
