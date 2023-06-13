import React from 'react';
import styles from "./LoginPage.module.scss";
import RegisterForm from "../components/Login-Register/RegisterForm.jsx";


const RegisterPage = () => {
	return (
		<div className={styles.LoginPage}>
			<h3>Register</h3>
			<RegisterForm/>
		</div>
	);
};

export default RegisterPage;
