import React from 'react';
import styles from "./LoginPage.module.scss";
import RegisterForm from "../components/Login-Register/RegisterForm.jsx";


const RegisterPage = () => {
	return (
		<main className={styles.LoginPage}>
			<h3>Register</h3>
			<RegisterForm/>
		</main>
	);
};

export default RegisterPage;
