import React, {useContext} from 'react';
import styles from './LoginForm.module.scss'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../../App.jsx";

const UserHandlingForm = ({targetEndpoint}) => {
	const {user, setUser} = useContext(UserContext);
	const [errorMessage, setErrorMessage] = React.useState("");
	const navigate = useNavigate();

	const labelError = {
		color: `${errorMessage ? "#ff1111" : "var(--primary-paragraph-color)"}`
	}
	const inputError = {
		border: `2px solid ${errorMessage ? "#ff1111" : "var(--primary-border-color)"}`
	};

	const resetError = () => {
		setErrorMessage("");
	};

	const handleLogin = async (event) => {
		event.preventDefault();

		const username = event.target[0].value;
		const password = event.target[1].value;

		try {
			const response = await axios.post(targetEndpoint, {username, password});
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
				<a href="" onClick={() => {
					window.alert("Yea, sorry we don't have password recovery yet.");
				}}>Forgot your password?</a>
			</fieldset>
			<input type="submit" value="Login"/>
		</form>
	);
};

export default UserHandlingForm;