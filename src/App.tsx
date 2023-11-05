import React from "react";
import { initializeApp } from "firebase/app";
import { useRecoilValue, useRecoilState } from "recoil";
import {
	authLoadingState,
	fbUserState,
	firebaseAppState,
	themeState,
} from "./shared/state";

import { Loading, NavMenu } from "./components";
import { Routes } from "./pages";

import "./global.scss";
import styles from "./App.module.scss";
import { ANOM_ROUTES, FIREBASE_CONFIG } from "./shared/constants";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { cloneObj } from "./shared/helpers/utils";
import { useLocation, useNavigate } from "react-router-dom";

export default function App() {
	const activeTheme = useRecoilValue(themeState);
	const [firebaseApp, setFirebaseApp] = useRecoilState(firebaseAppState);
	const [fbUser, setFbUser] = useRecoilState(fbUserState);
	const [isAuthLoading, setIsAuthLoading] = useRecoilState(authLoadingState);
	const { pathname } = useLocation();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!firebaseApp) {
			const app = initializeApp(FIREBASE_CONFIG);

			setFirebaseApp(app);
		}

		const observer = onAuthStateChanged(getAuth(), (user) => {
			setIsAuthLoading(false);
			setFbUser(cloneObj(user));
		});

		return () => {
			observer();
		};
	}, []);

	React.useEffect(() => {
		if (!isAuthLoading && !fbUser && !ANOM_ROUTES.includes(pathname)) {
			navigate("/");
		}
	}, [isAuthLoading, fbUser, ANOM_ROUTES, pathname]);

	return (
		<main
			id="mainContainer"
			className={`${styles.main} ${styles[activeTheme]}`}
		>
			<div id="diceContainer" />

			{!isAuthLoading ? (
				<Routes />
			) : (
				<section className={styles.loadingContainer}>
					<Loading showInner />
				</section>
			)}

			{!!fbUser && <NavMenu />}
		</main>
	);
}
