import React from 'react';
import styles from "./RegisterPage.module.scss";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const RegisterPage = () => {
	const [errorMessage, setErrorMessage] = React.useState("");

	const navigate = useNavigate();

	const handleRegister = async (event) => {
		event.preventDefault();

		const username = event.target[0].value;
		const password = event.target[1].value;

		try {
			const response = await axios.post("/api/register", {username, password});
			localStorage.setItem("userToken", JSON.stringify(response.data));

			navigate("/list")
		} catch (error) {
			setErrorMessage(error.message);
		}
	}

	const handlePasswordRecovery = async (event) => {
		window.alert("Yea, sorry we don't have password recovery yet.");
	}

	return (
		<div className={styles.RegisterPage}>
			<hgroup>
				<h3>Register</h3>
			</hgroup>
			<p>
				{errorMessage}
			</p>
			<form onSubmit={handleRegister}>
				<input type="text" placeholder="Username" required/>
				<input type="password" placeholder="Password" required/>
				<a href="" onClick={handlePasswordRecovery}>Forgot your password?</a>
				<input type="submit" value="Register"/>
			</form>
		</div>
	);
};

export default RegisterPage;
