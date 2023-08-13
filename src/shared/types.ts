export type SheetTypes = "character";

export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export type AttributeKey =
	| "fortitude"
	| "coordination"
	| "intelect"
	| "sagacity"
	| "willpower"
	| "presence";

export type ModuleOptions = "draenak";

export type Item = {
	id: string;
	name: string;
	description: string;
	weight: string;
};

export type Skill = {
	id: string;
	name: string;
	linkedAttribute: AttributeKey;
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

export type SecondaryAttribute = {
  current: number;
  limit?: number;
}

export type SecondaryAttributeKey =
	| "wound"
	| "stress"
	| "resistance"
	| "capacity";

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
	secondaryAttributes: Record<SecondaryAttributeKey, SecondaryAttribute>;
	binding: number;
	destiny: number;
	skills: Skill[];
	traits: Trait[];
  inventory: Item[];
  xp: {
    total: number;
    used: number;
  };
};

export type CharacterSheetList = Record<string, CharacterSheet>;
