import React, {useEffect} from 'react';
import styles from './LoginForm.module.scss'
import {useNavigate} from "react-router-dom";
import axios from "axios";

const UserHandlingForm = ({targetEndpoint}) => {
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

	const resetError = () => {
		setErrorMessage("");
	};

	const handleLogin = async (event) => {
		event.preventDefault();

		const username = event.target[1].value;
		const password = event.target[2].value;

		const lowercaseUsername = username.toLowerCase();

		try {
			const response = await axios.post("/api/login", {username: lowercaseUsername, password});

			localStorage.setItem("userToken", JSON.stringify(response.data));

			navigate("/list")
		} catch (error) {
			setErrorMessage("Invalid username or password");
		}
	};

	return (
		<form className={styles.LoginForm} onSubmit={handleLogin}>
			<p style={{
				display: errorMessage ? "block" : "none",
			}}>{errorMessage}</p>
			<fieldset>
				<label>
					Username
					<input type="text" placeholder="Your Username" required onChange={() => {
						resetError();
					}}/>
				</label>
				<label>
					Password
					<input type="password" placeholder="Your Password" required onChange={() => {
						resetError();
					}}/>
				</label>
				<a href="" onClick={() => {
					window.alert("Yea, sorry we don't have password recovery yet.");
				}}>Forgot your password?</a>
			</fieldset>
			<input type="submit" value="Login"/>
		</form>
	);
};

export default UserHandlingForm;
