import { AttributeKey, CharacterSheet } from "./types";

export const NAMESPACE = "jpoIE";

export const DEBUG = false;

export const MODULE_DATA = {
  draenak: {
    TRAITS: {
      GENERAL: [
        {
          id: "trait-1",
          name: "Ambidestria",
          description: "Capacidade de (as vezes) não derrubar as coisas com as duas mãos",
          cost: 10,
          level: 0,
        },
      ],
    },
    SKILLS: [
      {
        id: "skill-1",
        name: "Atletismo",
        linkedAttribute: "fortitude" as AttributeKey,
        level: 0,
      },
    ],
    RACES: {
      "race-1": {
        id: "race-1",
        name: "Humano",
        description: "Raça padrão",
        traits: [],
      },
      "race-2": {
        id: "race-2",
        name: "Elfo",
        description: "Raça de orelha pontuda",
        traits: [],
      },
      "race-3": {
        id: "race-3",
        name: "Anão",
        description: "Raça com uma estatura um pouco reduzida e mais resistente",
        traits: [],
      },
      "race-4": {
        id: "race-4",
        name: "Orc",
        description: "Raça bruta",
        traits: [],
      },
      "race-5": {
        id: "race-5",
        name: "Faelir",
        description: "Felinos humanóides",
        traits: [],
      },
      "race-6": {
        id: "race-6",
        name: "Siruna",
        description: "Símios humanóides",
        traits: [],
      },
    },
  }
}

export const termsList: {[key: string]: string} = {
  fortitude: "Físico",
  coordination: "Coordenação",
  intelect: "Intelecto",
  sagacity: "Sagacidade",
  willpower: "Vontade",
  presence: "Presença",
  wound: "Ferimento",
  stress: "Estresse",
  resistance: "Resistência",
  capacity: "Capacidade",
  binding: "Vínculo",
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
	traits: [],
  inventory: [],
  xp: {
    total: 100,
    used: 0,
  },
};