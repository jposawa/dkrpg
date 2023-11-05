import { CharacterSheet } from "../types";
import { RACES_DRAENAK, RACES_WIZARDING } from "./races";
import { SKILLS_DRAENAK, SKILLS_WIZARDING } from "./skills";
import { TRAITS_DRAENAK, TRAITS_WIZARDING } from "./traits";

export const NAMESPACE = "jpoIE";

export const DEBUG = false;

export const IMPORT_AUTOCLOSE = false;

export const AUTO_DISABLE_AFFINITY = false;

export const MODULE_DATA = {
  draenak: {
    NAME: "Draenak",
    TRAITS: TRAITS_DRAENAK,
    SKILLS: SKILLS_DRAENAK,
    RACES: RACES_DRAENAK,
  },
  wizarding: {
    NAME: "Wizarding World",
    TRAITS: TRAITS_WIZARDING,
    SKILLS: SKILLS_WIZARDING,
    RACES: RACES_WIZARDING,
  }
}

export const BASE_COST = {
  ATTRIBUTE: 5,
  SKILL: 4,
}

export const AFFINITY_BONUS = 2;

export const characterSheetModel: CharacterSheet = {
	id: "model",
	name: "Debuger Ontable",
	race: MODULE_DATA.draenak.RACES["race-1"],
  imageURL: "",
	attributes: {
		fortitude: 1,
		coordination: 1,
		intelect: 1,
		sagacity: 1,
		willpower: 1,
		presence: 1,
	},
  secondaryAttributes: {
    wound: {
      current: 0,
      limit: 11,
      finalMultiplier: 3,
    },
    stress: {
      current: 0,
      limit: 11,
      finalMultiplier: 2,
    },
    resistance: {
      current: 1,
    },
    capacity: {
      current: 0,
      limit: 9,
      finalMultiplier: 2,
    },
  },
  binding: 0,
  destiny: 0,
	skills: MODULE_DATA.draenak.SKILLS,
	traits: MODULE_DATA.draenak.TRAITS,
  inventory: [],
  xp: {
    total: 100,
    autoUsed: 0,
    manualUsed: 0,
  },
  module: "draenak",
};

export const ANOM_ROUTES = ["/home"];

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDtP73MjGbNPnMvyF8HQzhP_6ytRUQb2AQ",
  authDomain: "jprojetos.firebaseapp.com",
  projectId: "jprojetos",
  storageBucket: "jprojetos.appspot.com",
  messagingSenderId: "922019620365",
  appId: "1:922019620365:web:601dccc7516c09647c1744",
  measurementId: "G-4C4YTDGPP3"
};