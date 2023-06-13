import React from 'react';
import styles from "./LoginPage.module.scss";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoginForm from "../components/Login-Register/LoginForm.jsx";


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
	return (
		<div className={styles.LoginPage}>
			<h3>Login</h3>
			<LoginForm/>
		</div>
	);
};

export default LoginPage;
