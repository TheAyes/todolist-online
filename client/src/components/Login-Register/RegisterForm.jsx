import React, {useContext, useState} from 'react';
import UserForm from './UserForm';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../App.jsx";

const RegisterForm = () => {
	const {user, setUser} = useContext(UserContext);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (event) => {
		event.preventDefault();

		const username = event.target[1].value;
		const password = event.target[2].value;
		const confirmPassword = event.target[3].value;

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			const response = await axios.post("/api/register", {username, password});
			localStorage.setItem("userToken", JSON.stringify(response.data));
			navigate("/list");
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	const extraFields = (
		<>
			<label>
				Confirm Password
				<input type="password" placeholder="Your Password" required onChange={() => setErrorMessage("")}/>
			</label>
			<a></a>
		</>

	);

	return (
		<UserForm
			onSubmit={handleRegister}
			errorMessage={errorMessage}
			setErrorMessage={setErrorMessage}
			extraFields={extraFields}
			buttonText="Register"
		/>
	);
};

export default RegisterForm;
