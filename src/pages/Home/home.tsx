import React from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import styles from "./home.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { fbUserState, firebaseAppState } from "../../shared/state";
import { Button } from "../../components";

export const Home = () => {
	const firebaseApp = useRecoilValue(firebaseAppState);
	const [fbUser, setFbUser] = useRecoilState(fbUserState);

	const handleSignIn = React.useCallback(() => {
		if (!!firebaseApp) {
			const provider = new GoogleAuthProvider();
			const auth = getAuth();

			signInWithPopup(auth, provider)
				.then((result) => {
					// const credential = GoogleAuthProvider.credentialFromResult(result);
					// const token = credential?.accessToken;
					// const user = result.user;
				})
				.catch((error) => {
					console.error("Auth error", error);
				});
		}
	}, [firebaseApp]);

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Draenak RPG</h1>
			{!!fbUser ? (
				<p>
					Essa aplicação web permite você gerenciar as fichas de suas
					personagens dentro do sistema Draenak
				</p>
			) : (
				<div className={styles.loginContainer}>
					<p>Login necessário</p>
          <br/>
					<Button className={styles.loginBtn} type="button" onClick={handleSignIn}>
						Login
					</Button>
				</div>
			)}
			<br />
		</div>
	);
};
