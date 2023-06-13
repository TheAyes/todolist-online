import React from 'react';
import styles from "./LoginPage.module.scss";
import {useNavigate} from "react-router-dom";
import LoginForm from "../components/Login-Register/LoginForm.jsx";


const LoginPage = () => {
	const [errorMessage, setErrorMessage] = React.useState("");

	const navigate = useNavigate();

	const handlePasswordRecovery = async () => {
		window.alert("Yea, sorry we don't have password recovery yet.");
	}
	return (
		<main className={styles.LoginPage}>
			<h3>Login</h3>
			<LoginForm/>
		</main>
	);
};

export default LoginPage;
