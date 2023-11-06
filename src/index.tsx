import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<GoogleOAuthProvider clientId="922019620365-83lpt5od052ebv44k7u3gg0a820p37ma.apps.googleusercontent.com">
					<App />
				</GoogleOAuthProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
