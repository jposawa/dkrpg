import { NAMESPACE } from "../constants";

/** Small utility method to transform string to use NAMESPACE
@param rawValue The initial string that will get NAMESPACE prefix
@return A transformed string that will have your NAMESPACE as prefix
*/
export const withNamespace = (rawValue: string): string => {
	return `${NAMESPACE}#${rawValue}`;
};


/** Small utility method to clone an Object
@param {Record<any, any>} baseObj Object that you want to clone
@return A new Object that's a copy of the baseObj
*/
export const cloneObj = (baseObj: Record<any, any>): Record<any, any> => {
  return JSON.parse(JSON.stringify(baseObj));
}

export const isObjEqual = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Save data as string in SessionStorage, which is persisted only for open browser tab
 * @param key The identifier of saved data
 * @param value The actual value of saved data
 * @param needParse (optional) In case you are passing an Object (Which includes Arrays) you need to parse to string
 */
export const setSessionStorage = (
	key: string,
	value: any,
	needParse?: boolean
) => {
	const appKey = withNamespace(key);
	const savedValue = needParse ? JSON.stringify(value) : value;

	sessionStorage.setItem(appKey, savedValue);
};

/**
 * Load data from SessionStorage, which is persisted only for open browser tab
 * @param key The identifier of saved data
 * @param needParse (optional) In case you are getting an Object (Which includes Arrays) you need to parse from string to object
 * @return Saved value as String or, if your parse it, as Object
 */
export const getSessionStorage = (key: string, needParse?: boolean) => {
	const appKey = withNamespace(key);
	const rawValue = sessionStorage.getItem(appKey);

	return needParse && rawValue ? JSON.parse(rawValue) : rawValue;
};

/**
 * Save data as string in LocalStorage, which is persisted only for open browser tab
 * @param key The identifier of saved data
 * @param value The actual value of saved data
 * @param needParse (optional) In case you are passing an Object (Which includes Arrays) you need to parse to string
 */
export const setLocalStorage = (
	key: string,
	value: any,
	needParse?: boolean
) => {
	const appKey = withNamespace(key);
	const savedValue = needParse ? JSON.stringify(value) : value;

	localStorage.setItem(appKey, savedValue);
};

/**
 * Load data from LocalStorage, which is persisted only for open browser tab
 * @param key The identifier of saved data
 * @param needParse (optional) In case you are getting an Object (Which includes Arrays) you need to parse from string to object
 * @return Saved value as String or, if your parse it, as Object
 */
export const getLocalStorage = (key: string, needParse?: boolean) => {
	const appKey = withNamespace(key);
	const rawValue = localStorage.getItem(appKey);

	return needParse && rawValue ? JSON.parse(rawValue) : rawValue;
};


export const pseudoRandomNumber = (
	min: number,
	max: number,
	useMax: boolean = false
): { pseudoRandomResult: number; pseudoSeed: number } => {
	const randomMultiplier = useMax ? max - min + 1 : max - min;
	const pseudoSeed = Math.random();

	const pseudoRandomResult = Math.floor(pseudoSeed * randomMultiplier + min);

	// console.table({ pseudoSeed, pseudoRandomResult });

	return { pseudoRandomResult, pseudoSeed };
};

export const randomNumber = (
	min: number,
	max: number,
	useMax: boolean = false
): number => {
	const randomMultiplier = useMax ? max - min + 1 : max - min;
	const seedArray = new Uint32Array(20);
	const randomValues = window.crypto.getRandomValues(seedArray);
	const { pseudoRandomResult, pseudoSeed } = pseudoRandomNumber(0, 20);

	const cryptoSeed = randomValues[pseudoRandomResult];
	let chosenSeed = `${cryptoSeed * pseudoSeed}`;
	const seedParts = chosenSeed.split(".");
	chosenSeed = `0.${
		(parseInt(seedParts[1]) + parseInt(seedParts[0])) * pseudoRandomResult
	}`;

	// console.log("chosenSeed", chosenSeed);

	return Math.floor(parseFloat(chosenSeed) * randomMultiplier + min);
};

export const leadingZero = (rawNumber: number): string => {
	if (isNaN(rawNumber) || rawNumber < 0) {
		return "0";
	}

	return rawNumber < 10 ? `0${rawNumber}` : `${rawNumber}`;
};

export const encode64 = (obj: Object): string => {
	return btoa(JSON.stringify(obj));
};

export const decode64 = (code: string): Object => {
	return JSON.parse(atob(code));
};

export const diceSideNumberFromLevel = (level: number) => {
	if (level < 1) {
		return 0;
	}

	if (level > 5) {
		return 20;
	}

	return 2 + 2 * level;
};
