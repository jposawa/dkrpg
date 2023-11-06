import React from "react";

import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signInWithRedirect,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";

import styles from "./home.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	authLoadingState,
	fbUserState,
	firebaseAppState,
} from "../../shared/state";
import { Button, Input } from "../../components";
import { useAntToast } from "../../shared/hooks";
import { getLocalStorage, setLocalStorage } from "../../shared/helpers/utils";

const actionCodeSettings = {
	// URL you want to redirect back to. The domain (www.example.com) for this
	// URL must be in the authorized domains list in the Firebase Console.
	url: window.location.href,
	// This must be true.
	handleCodeInApp: true,
};

export const Home = () => {
	const firebaseApp = useRecoilValue(firebaseAppState);
	const [fbUser, setFbUser] = useRecoilState(fbUserState);
	const { openToast } = useAntToast();
	const [authLoading, setAuthLoading] = useRecoilState(authLoadingState);

	const handleSignIn = React.useCallback(() => {
		if (!!firebaseApp) {
			const provider = new GoogleAuthProvider();
			const auth = getAuth();

			signInWithRedirect(auth, provider);

			// signInWithPopup(auth, provider)
			// 	.then((result) => {
			// 		// const credential = GoogleAuthProvider.credentialFromResult(result);
			// 		// const token = credential?.accessToken;
			// 		// const user = result.user;
			// 	})
			// 	.catch((error) => {
			// 		console.error("Auth error", error);
			// 	});
		}
	}, [firebaseApp]);

	const sendSignInLink = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const {
			currentTarget: { email },
		} = event;

		if (!email?.value) {
			openToast("Email necessário");
			return;
		}

		const auth = getAuth();
		sendSignInLinkToEmail(auth, email.value, actionCodeSettings)
			.then(() => {
				openToast(`Link enviado para ${email.value}`);
				setLocalStorage("loginEmail", email.value);
			})
			.catch((error) => {
				console.error("Error sending link", error);
			});
	};

	const confirmLinkAuth = () => {
		const auth = getAuth();

		if (isSignInWithEmailLink(auth, window.location.href)) {
			setAuthLoading(true);
			const storedEmail = getLocalStorage("loginEmail");

			signInWithEmailLink(auth, storedEmail, window.location.href)
				.then(() => {
					setLocalStorage("loginEmail");
				})
				.catch((error) => {
					console.error("Error finalizing auth", error);
				})
				.finally(() => {
					setAuthLoading(false);
				});
		}
	};

	React.useEffect(() => {
		confirmLinkAuth();
	}, []);

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
					<br />
					<form onSubmit={sendSignInLink}>
						<label htmlFor="loginEmail">Insira email para login</label>
						<Input
							id="loginEmail"
							name="email"
							title="Login email"
							placeholder="email@example.com"
							required
						/>
						<Button
							className={styles.loginBtn}
							type="submit"
							onClick={() => {}}
						>
							Email link
						</Button>
						{/* <Button
							className={styles.loginBtn}
							type="button"
							onClick={handleSignIn}
						>
							Google Login
						</Button> */}
					</form>
				</div>
			)}
			<br />
		</div>
	);
};
