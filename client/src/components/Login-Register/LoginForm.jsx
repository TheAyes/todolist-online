import React, {useState} from 'react';
import UserForm from './UserForm';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		const username = event.target[1].value.toLowerCase();
		const password = event.target[2].value;

		try {
			const response = await axios.post("/api/login", {username, password});
			localStorage.setItem("userToken", JSON.stringify(response.data));
			navigate("/list");
		} catch (error) {
			setErrorMessage("Invalid username or password");
		}
	};

	const extraFields = (
		<a href="" onClick={() => {
			window.alert("Yea, sorry we don't have password recovery yet.");
		}}>Forgot your password?</a>
	)

	return (
		<UserForm
			onSubmit={handleLogin}
			errorMessage={errorMessage}
			setErrorMessage={setErrorMessage}
			buttonText="Login"
			extraFields={extraFields}
		/>
	);
};

export default LoginForm;
