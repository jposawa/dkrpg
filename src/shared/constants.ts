import { Attribute, CharacterSheet } from "./types";

export const NAMESPACE = "jpoIE";

export const DEBUG = true;

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
        linkedAttribute: "fortitude" as Attribute,
        level: 0,
      },
    ],
  }
}

export const attributesList = {
  fortitude: "Físico",
  coordination: "Coordenação",
  intelect: "Intelecto",
  sagacity: "Sagacidade",
  willpower: "Vontade",
  presence: "Presença",
}

export const characterSheetModel: CharacterSheet = {
	id: "model",
	name: "Debuger Ontable",
	race: {
    id: "race-1",
    name: "Humano",
    description: "Igual o Ken, apenas um Humano",
    traits: [],
  },
  imageURL: "",
	attributes: {
		fortitude: 2,
		coordination: 2,
		intelect: 1,
		sagacity: 1,
		willpower: 3,
		presence: 4,
	},
	skills: MODULE_DATA.draenak.SKILLS,
	traits: [],
};