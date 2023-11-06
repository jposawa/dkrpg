import { MODULE_DATA } from './constants/general';
export type SheetTypes = "character";

export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export type AttributeKey =
	| "fortitude"
	| "coordination"
	| "intelect"
	| "sagacity"
	| "willpower"
	| "presence";

export type ModuleOptions = "draenak" | "wizarding";

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
  hasAffinity?: boolean;
  description?: string;
};

export type Trait = {
	id: string;
	name: string;
	description: string;
	cost: number;
	level: number;
	maxLevel?: number;
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
	finalLimit?: number;
	finalMultiplier?: number;
	limitBonus?: number;
};

export type SecondaryAttributeKey =
	| "wound"
	| "stress"
	| "resistance"
	| "capacity";

export type XpType = "total" | "autoUsed" | "manualUsed";

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
	skills: Record<string, Skill>;
	traits: Trait[];
	inventory: Item[];
	xp: {
		total: number;
		autoUsed: number;
		manualUsed: number;
	};
  module: ModuleOptions;
  userId?: string;
};

export type CharacterSheetList = Record<string, CharacterSheet>;
