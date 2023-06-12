import styles from "./App.module.scss";
import React, {createContext} from "react";
import TodoPage from "./pages/TodoPage.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export const UserContext = createContext({});
const App = () => {
	const [userToken, setUserToken] = React.useState(localStorage.getItem("userToken"));
	return (
		<>
			<hgroup className={styles.app}>
				<h1>Todo App</h1>
				<h3>Your trusted todo app online!</h3>
			</hgroup>
			<UserContext.Provider value={{userToken, setUserToken}}>
				<Routes>
					<Route path="/list" element={<TodoPage/>}/>
					<Route path="/login" element={<LoginPage/>}/>
					<Route path="/register" element={<RegisterPage/>}/>
				</Routes>
			</UserContext.Provider>
		</>

	);
};

export default App;
