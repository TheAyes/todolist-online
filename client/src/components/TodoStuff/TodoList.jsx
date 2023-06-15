import React, {useCallback, useEffect, useState} from 'react';
import TodoItem from "./TodoItem.jsx";
import axios from "axios";

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [userToken, setUserToken] = useState("");

	useEffect(() => {
		const userToken = JSON.parse(localStorage.getItem("userToken"));
		setUserToken(userToken);
	}, [])

	const fetchTodos = useCallback(async () => {
		const userToken = JSON.parse(localStorage.getItem("userToken"));
		const response = await axios.get("/api/todos", {
			headers: {
				"Authorization": `Bearer ${userToken.accessToken}`
			}
		});

		setTodos(response.data);
	}, []);

	useEffect(() => {
		fetchTodos()
	}, [fetchTodos]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const {data, error} = await requestAdd({
			title: inputValue,
			status: false,
		});
		if (!error) return setInputValue("");
		window.alert(error);
	};


	const requestAdd = useCallback(async (newTodo) => {
		try {
			const response = await axios.post("/api/todos", {
				title: newTodo.title,
				status: newTodo.status,
			}, {
				headers: {
					"Authorization": `Bearer ${userToken.accessToken}`
				}
			});
			setTodos(prevTodos => [...prevTodos, response.data]);
			return {data: response.data, error: null};
		} catch (error) {
			return {data: null, error}
		}

	}, [todos]);

	const requestComplete = useCallback(async (id) => {
		try {
			const foundIndex = todos.findIndex((item) => item.id === id);


			const response = await axios.patch(`/api/todos/${id}?status=${!todos[foundIndex].status}`, null, {
				headers: {
					"Authorization": `Bearer ${userToken.accessToken}`
				}
			});

			const updatedTodos = [...todos];
			updatedTodos[foundIndex] = response.data;
			setTodos(updatedTodos);

			return {data: response.data, error: null}
		} catch (error) {
			return {data: null, error}
		}

	}, [todos]);

	const requestDelete = useCallback(async (id) => {
		try {
			const response = await axios.delete(`/api/todos/${id}`, {
				headers: {
					"Authorization": `Bearer ${userToken.accessToken}`
				}
			});
			if (response.status === 200) {
				const updatedTodos = todos.filter(todo => todo.id !== id);
				setTodos(updatedTodos);
			}
			return {data: response.data, error: null}
		} catch (error) {
			return {data: null, error}
		}
	}, [todos]);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					id="addTodoField"
					value={inputValue}
					placeholder="Add a new todo!"
					onChange={event => setInputValue(event.target.value)}
				/>
			</form>
			<ul>
				{todos.map((todo) => {
					return <TodoItem
						key={todo.id}
						propId={todo.id}
						propStatus={todo.status}
						propTitle={todo.title}
						propComplete={requestComplete}
						propDelete={requestDelete}
					/>
				})}
			</ul>
		</div>
	);
};

export default TodoList;
