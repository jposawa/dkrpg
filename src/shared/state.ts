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

export const diceBoxState = atom<any>({
	key: withNamespace("diceBox"),
	default: null,
});

export const rollingState = atom<boolean>({
	key: withNamespace("rolling"),
	default: false,
});

export const firebaseAppState = atom<any>({
	key: withNamespace("firebaseDKRPG"),
	default: null,
});

export const fbUserState = atom<any>({
	key: withNamespace("fbUserDKRPG"),
	default: null,
});

export const authLoadingState = atom<boolean>({
	key: withNamespace("authLoading"),
	default: true,
});

export const characterSheetsListState = atom<Record<string, CharacterSheet>>({
	key: withNamespace("characterSheetsList"),
	default: {},
});
