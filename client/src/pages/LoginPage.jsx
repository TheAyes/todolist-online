import React from 'react';
import styles from "./LoginPage.module.scss";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const LoginPage = () => {
	const [errorMessage, setErrorMessage] = React.useState("");

	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		const username = event.target[0].value;
		const password = event.target[1].value;

		try {
			const response = await axios.post("/api/login", {username, password});
			localStorage.setItem("userToken", JSON.stringify(response.data));

			navigate("/list")
		} catch (error) {
			setErrorMessage("Invalid username or password");
		}


	}

	const handlePasswordRecovery = async () => {
		window.alert("Yea, sorry we don't have password recovery yet.");
	}
	console.log(errorMessage)
	return (
		<div className={styles.LoginPage}>
			<hgroup>
				<h3>Login</h3>
			</hgroup>
			<p>{errorMessage}</p>
			<form onSubmit={handleLogin}>
				<fieldset style={{
					border: `2px solid ${errorMessage ? "#ff4400" : "transparent"}`,
					padding: "1rem",
				}}>
					<input type="text" placeholder="Username" required/>
					<input type="password" placeholder="Password" required/>
				</fieldset>

				<a href="" onClick={handlePasswordRecovery}>Forgot your password?</a>
				<input type="submit" value="Login"/>
			</form>
		</div>
	);
};

export default LoginPage;
