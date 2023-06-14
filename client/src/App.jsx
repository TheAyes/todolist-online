import styles from "./App.module.scss";
import React, {createContext, useEffect} from "react";
import TodoPage from "./pages/TodoPage.jsx";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";


export const UserContext = createContext(null);

const App = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [user, setUser] = React.useState(null);

	const [interactionCount, setInteractionCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

	useEffect(() => {
		const fetchVisitCount = async () => {
			const response = await axios.get("/api/statistics/interactions");
			setInteractionCount(response.data.interactionCount);
		}
		fetchVisitCount();

		const fetchUserCount = async () => {
			const response = await axios.get("/api/statistics/users");
			setUserCount(response.data.userCount);
		}
		fetchUserCount();
	}, [location.pathname]);

	useEffect(() => {

		try {
			const token = JSON.parse(localStorage.getItem("userToken"));

			const refreshToken = async () => {
				try {
					const tokenResponse = await axios.post("/api/refresh", {}, {headers: {"Authorization": `Bearer ${token.refreshToken}`}})
					localStorage.setItem("userToken", JSON.stringify(tokenResponse.data));

					const userdataResponse = await axios.get("/api/user", {headers: {"Authorization": `Bearer ${tokenResponse.data.accessToken}`}})
					setUser(userdataResponse.data.user);
				} catch (error) {
					console.warn(error);
				}

			};
			refreshToken();
		} catch (error) {
			console.error(error);
		}

	}, [location.pathname]);

	useEffect(() => {
		const redirect = async () => {
			if (location.pathname === "/") {
				navigate("/login")
			}
		}
		redirect();
	}, [location.pathname]);

	useEffect(() => {
		if (user) {
			navigate("/list")
		}
	}, [user]);

	return (
		<UserContext.Provider value={{user, setUser}}>
			<div className={styles.App}>
				<header>
					<hgroup>
						<h1>Todo App</h1>
						<h3>Your trusted todo app online!</h3>
					</hgroup>
					<div>
						{!!user ?
							<>
								<p>
									Logged in as {user.username}
								</p>
								<button onClick={() => {
									const token = JSON.parse(localStorage.getItem("userToken"));
									if (!token) return console.error("No token found");

									axios.post(
										"/api/logout",
										{
											accessToken: token.accessToken,
											refreshToken: token.refreshToken
										}, {
											headers: {
												"Authorization": `Bearer ${token.accessToken}`
											}
										})
										.then(() => {
											localStorage.removeItem("userToken");
											setUser(null);
											navigate("/login")
										})
								}}>Logout
								</button>
							</> :
							<>
								<button onClick={() => {
									navigate("/login")
								}}>Login
								</button>
								<button onClick={() => {
									navigate("/register")
								}}>Register
								</button>
							</>
						}
					</div>
				</header>

				<Routes>
					<Route path="/list" element={<TodoPage/>}/>
					<Route path="/login" element={<LoginPage/>}/>
					<Route path="/register" element={<RegisterPage/>}/>
				</Routes>

				<footer>
					<p>Created by <a href="https://github.com/TheAyes" target="_blank"
									 rel="noopener noreferrer">TheAyes</a> ❤</p>
					<article>
						<p>Amount of Users: {userCount}</p>
						<p>Total Interactions: {interactionCount}</p>
					</article>

				</footer>
			</div>
		</UserContext.Provider>
	);
};

export default App;
