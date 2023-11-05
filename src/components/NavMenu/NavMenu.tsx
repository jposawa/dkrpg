import React from "react";
import { getAuth, signOut } from "firebase/auth";

import { Link, useLocation } from "react-router-dom";
import {
	CodeSandboxOutlined,
	HomeOutlined,
	LogoutOutlined,
	SettingOutlined,
	SolutionOutlined,
} from "@ant-design/icons";

import styles from "./NavMenu.module.scss";
import { useRecoilValue } from "recoil";
import { fbUserState, firebaseAppState } from "../../shared/state";
import { Button } from "..";

export const NavMenu = () => {
	const { pathname } = useLocation();
	const firebaseApp = useRecoilValue(firebaseAppState);
	const fbUser = useRecoilValue(fbUserState);
	const PAGES_LIST = [
		{
			url: "/",
			name: "Início",
			icon: <HomeOutlined />,
			altPath: "/home",
		},
		{
			url: "/library/",
			name: "Fichas",
			icon: <SolutionOutlined />,
		},
		// {
		// 	url: "/dices",
		// 	name: "Dados",
		// 	icon: <CodeSandboxOutlined />,
		// },
		// {
		// 	url: "/settings",
		// 	name: "Configs",
		// 	icon: <SettingOutlined />,
		// },
	];

	const handleSignOut = React.useCallback(() => {
		if (!firebaseApp) {
			console.warn("Firebase app not found");
			return;
		}
		if (window.confirm("Confirma que deseja fazer logout?")) {
			const auth = getAuth();
			auth
				.signOut()
				.then(() => {
					console.log("Signing out");
				})
				.catch((error) => {
					console.error("Error on sign out", error);
				});
		}
	}, [firebaseApp]);

	return (
		<nav className={styles.navMenu}>
			{PAGES_LIST.map((page, index) => (
				<Link
					key={`item${index}`}
					to={page.url}
					className={
						pathname === page.url || pathname === page.altPath
							? styles.currentPage
							: ""
					}
				>
					{page.icon}
					<p>{page.name}</p>
				</Link>
			))}

			{!!fbUser && (
				<Button
					className={styles.signOutBtn}
					type="button"
					onClick={handleSignOut}
				>
					<LogoutOutlined />
					<p>Logout</p>
				</Button>
			)}
		</nav>
	);
};
