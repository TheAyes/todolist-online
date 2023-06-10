import React from 'react';
import styles from "./LoginPage.module.scss";
import {post} from "axios";
import {UserContext} from "../App.jsx";


const LoginPage = () => {
	const [errorMessage, setErrorMessage] = React.useState("");
	const {userToken, setUserToken} = React.useContext(UserContext);

	const handleLogin = async (event) => {
		event.preventDefault();

		const username = event.target[0].value;
		const password = event.target[1].value;

		const response = await post("/api/login", {username, password});

		if (response.status !== 200) {
			setErrorMessage("Invalid username or password");
			return;
		}

		localStorage.setItem("userToken", response.data.token);
	}

	const handlePasswordRecovery = async (event) => {
		window.alert("Yea, sorry we don't have password recovery yet.");
	}

	return (
		<div className={styles.LoginPage}>
			<hgroup>
				<h3>Login</h3>
			</hgroup>
			<p id="errorMessage">

			</p>
			<form onSubmit={handleLogin}>
				<input type="text" placeholder="Username" required/>
				<input type="password" placeholder="Password" required/>
				<a href="" onClick={handlePasswordRecovery}>Forgot your password?</a>
				<input type="submit" value="Login"/>
			</form>
		</div>
	);
};

export default LoginPage;
