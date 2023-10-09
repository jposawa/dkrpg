import { CharacterSheet } from "../types";
import { RACES_DRAENAK } from "./races";
import { SKILLS_DRAENAK } from "./skills";
import { TRAITS_DRAENAK } from "./traits";

export const NAMESPACE = "jpoIE";

export const DEBUG = false;



export const MODULE_DATA = {
  draenak: {
    TRAITS: TRAITS_DRAENAK,
    SKILLS: SKILLS_DRAENAK,
    RACES: RACES_DRAENAK,
  }
}



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
    used: 0,
  },
};