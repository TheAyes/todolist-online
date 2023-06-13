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

	const [visitCount, setVisitCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

	useEffect(() => {
		const fetchVisitCount = async () => {
			const response = await axios.get("/api/statistics/interactions");
			setVisitCount(response.data.interactionCount);
		}
		fetchVisitCount();

		const fetchUserCount = async () => {
			const response = await axios.get("/api/statistics/users");
			setUserCount(response.data.userCount);
		}
		fetchUserCount();
	}, [location.pathname]);

	useEffect(() => {
		if (!user) {
			const token = JSON.parse(localStorage.getItem("userToken"));
			if (token) {
				try {
					axios.post("/api/refresh", {}, {headers: {"Authorization": `Bearer ${token.accessToken}`}})
						.then(response => {
							setUser(response.data);
						})
						.catch(error => {
							console.error(error);
						})
				} catch (error) {
					navigate("/login")
				}

			}
		}
	}, [])

	useEffect(() => {
		const token = JSON.parse(localStorage.getItem("userToken"));

		const redirect = async () => {
			if (location.pathname === "/") {
				navigate("/login")
			}
		}
		redirect();
	}, [location.pathname]);

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
								<button onClick={() => {
								}}>
									Logged in as {user.username}
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
						<p>Total Interaction: {visitCount}</p>
					</article>

				</footer>
			</div>
		</UserContext.Provider>
	);
};

export default App;
