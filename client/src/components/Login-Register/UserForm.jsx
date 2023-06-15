import React, {useEffect} from 'react';
import styles from './UserForm.module.scss';

const UserForm = ({onSubmit, errorMessage, setErrorMessage, extraFields, buttonText}) => {

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

	return (
		<form className={styles.UserForm} onSubmit={onSubmit}>
			<p style={{display: errorMessage ? "block" : "none"}}>{errorMessage}</p>
			<fieldset>
				<label>
					Username
					<input type="text" placeholder="Your Username" required onChange={resetError}/>
				</label>
				<label>
					Password
					<input type="password" placeholder="Your Password" required onChange={resetError}/>
				</label>

				{extraFields}
			</fieldset>
			<input type="submit" value={buttonText}/>
		</form>
	);
};

export default UserForm;
