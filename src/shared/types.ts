export type SheetTypes = "character";

export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export type Attribute =
	| "fortitude"
	| "coordination"
	| "intelect"
	| "sagacity"
	| "willpower"
	| "presence";

export type ModuleOptions = "draenak";

export type Skill = {
	id: string;
	name: string;
	linkedAttribute: Attribute;
	level: number;
};

export type Trait = {
	id: string;
	name: string;
	description: string;
	cost: number;
	level: number;
};

export type Race = {
	id: string;
	name: string;
	description: string;
	traits: Trait[];
};

export type CharacterSheet = {
	id: string;
	name: string;
	race: Race;
  imageURL: string;
	attributes: {
		fortitude: number; //Físico
		coordination: number;
		intelect: number;
		sagacity: number;
		willpower: number;
		presence: number;
	};
	skills: Skill[];
	traits: Trait[];
};
