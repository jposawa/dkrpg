import { getDatabase, onValue, ref, update } from "firebase/database";
import {
	cloneObj,
	getDbPath,
	setSessionStorage,
} from "../shared/helpers/utils";
import { CharacterSheet } from "../shared/types";

export const getFbDataRef = (tablePath?: string) => {
	const path = getDbPath(tablePath);
	const database = getDatabase();

	const responseRef = ref(database, path);

	return responseRef;
};

export const updateFbData = (newData: any, tablePath?: string) => {
	const path = getDbPath(tablePath);
	const database = getDatabase();
	const updates: Record<string, any> = {};

	updates[path] = newData;

	update(ref(database), updates)
		.then()
		.catch((error) => {
			console.error("Error on data update", error);
		});
};

export const syncUserDatabase = (user: any) => {
	if (!!user) {
		const userRef = getFbDataRef(`users/${user.uid}`);

		onValue(
			userRef,
			(snapshot) => {
				const userData = snapshot.val();
				if (!userData) {
					const newData = {
						name: user.displayName,
						email: user.email,
						uid: user.uid,
					};

					updateFbData(newData, `users/${user.uid}`);
				}

				setSessionStorage("syncedUser", 1);
			},
			{
				onlyOnce: true,
			}
		);
	}
};

export const getModuleData = (moduleKey: string, callback: any) => {
	const moduleRef = getFbDataRef(`moduleData/${moduleKey}`);

	onValue(
		moduleRef,
		(snapshot) => {
			const moduleData = snapshot.val();

			callback(cloneObj(moduleData));
		},
		{
			onlyOnce: true,
		}
	);
};

export const saveDbCharacter = (sheet: CharacterSheet) => {
	updateFbData(sheet, `characterSheets/${sheet.userId}/${sheet.id}`);
};

export const getSheetList = (userId: string, updateList: any) => {
  const sheetListRef = getFbDataRef(`characterSheets/${userId}/`);

  onValue(
    sheetListRef,
    (snapshot) => {
      const sheetList = snapshot.val();

      updateList(sheetList);
    }
  )
}
