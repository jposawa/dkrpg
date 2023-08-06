import { NAMESPACE } from "../constants";

/** Small utility method to transform string to use NAMESPACE
@param rawValue The initial string that will get NAMESPACE prefix
@return A transformed string that will have your NAMESPACE as prefix
*/
export const withNamespace = (rawValue: string):string => {
  return `${NAMESPACE}#${rawValue}`;
}

/**
* Save data as string in SessionStorage, which is persisted only for open browser tab
* @param key The identifier of saved data
* @param value The actual value of saved data
* @param needParse (optional) In case you are passing an Object (Which includes Arrays) you need to parse to string
*/
export const setSessionStorage = (key: string, value: any, needParse?: boolean) => {
  const appKey = withNamespace(key);
  const savedValue = needParse ? JSON.stringify(value) : value;

  sessionStorage.setItem(appKey, savedValue);
}

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
}

export const randomNumber = (min: number, max: number, useMax: boolean = false): number => {
  const randomMultiplier = useMax ? max - min + 1 : max - min;
  
  return Math.floor(Math.random() * randomMultiplier + min);
}

export const leadingZero = (rawNumber: number): string => {
  if (isNaN(rawNumber) || rawNumber < 0) {
    return "0";
  }

  return rawNumber < 10 ? `0${rawNumber}` : `${rawNumber}`;
}

export const encode64 = (obj: Object): string => {
  return btoa(JSON.stringify(obj));
}

export const decodificaCartela = (code: string): Object => {
  return JSON.parse(atob(code));
}
