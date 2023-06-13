import React, {useContext} from 'react';
import styles from './LoginForm.module.scss'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../../App.jsx";

const UserHandlingForm = ({targetEndpoint}) => {
	const {user, setUser} = useContext(UserContext);
	const [errorMessage, setErrorMessage] = React.useState("");
	const navigate = useNavigate();

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
		<form className={styles.LoginForm}>
			<p>{errorMessage}</p>
			<fieldset onSubmit={handleLogin} style={{
				border: `2px solid ${errorMessage ? "#ff4400" : "transparent"}`,
				padding: "1rem",
			}}>
				<input type="text" placeholder="Username" required/>
				<input type="password" placeholder="Password" required/>
				<a href="" onClick={() => {
					window.alert("Yea, sorry we don't have password recovery yet.");
				}}>Forgot your password?</a>
			</fieldset>
			<input type="submit" value="Login"/>
		</form>
	);
};

export default UserHandlingForm;
