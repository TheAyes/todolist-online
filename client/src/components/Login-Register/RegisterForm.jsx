import React, {useContext, useEffect} from 'react';
import styles from './LoginForm.module.scss'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../../App.jsx";

const UserHandlingForm = ({targetEndpoint}) => {
	const {user, setUser} = useContext(UserContext);
	const [errorMessage, setErrorMessage] = React.useState("");
	const navigate = useNavigate();


	useEffect(() => {
		if (errorMessage) {
			document.querySelectorAll("form > fieldset > label > input").forEach((input) => {
				input.classList.add("error");
			});
		} else {
			document.querySelectorAll("form > fieldset > label > input").forEach((input) => {
				input.classList.remove("error");
			});
		}
	}, [errorMessage]);

	const labelError = {
		color: `${errorMessage ? "#ff1111" : "var(--primary-paragraph-color)"}`
	}
	const inputError = {
		border: `2px solid ${errorMessage ? "#ff1111" : "var(--primary-border-color)"}`
	};

	const resetError = () => {
		setErrorMessage("");
	};

	const handleRegister = async (event) => {
		event.preventDefault();

		const username = event.target[0].value;
		const password = event.target[1].value;
		const confirmPassword = event.target[2].value;

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			const response = await axios.post(targetEndpoint, {username, password});
			localStorage.setItem("userToken", JSON.stringify(response.data));

			navigate("/list")
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return (
		<form className={styles.LoginForm} onSubmit={handleRegister}>
			<p style={{
				display: errorMessage ? "block" : "none",
			}}>{errorMessage}</p>
			<fieldset>
				<label>
					Username
					<input type="text" placeholder="Your Username" required style={inputError} onChange={() => {
						resetError();
					}}/>
				</label>
				<label>
					Password
					<input type="password" placeholder="Your Password" required style={inputError} onChange={() => {
						resetError();
					}}/>
				</label>
				<label>
					Confirm Password
					<input type="password" placeholder="Your Password" required style={inputError} onChange={() => {
						resetError();
					}}/>
				</label>
				<a></a>
			</fieldset>
			<input type="submit" value="Register"/>
		</form>
	);
};

export default UserHandlingForm;
