import React, {useCallback, useEffect, useState} from 'react';
import TodoItem from "./TodoItem.jsx";
import axios from "axios";

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");

	const fetchTodos = useCallback(async () => {
		const response = await axios.get("/api/todos", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("userToken")}`,
			}
		});
		setTodos(response.data);
	}, []);

	useEffect(() => {
		fetchTodos().then(r => r);
	}, [fetchTodos]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const {data, error} = await requestAdd({
			title: inputValue,
			status: false,
		});
		if (!error) setInputValue("");
		window.alert(error);
	};


	const requestAdd = useCallback(async (newTodo) => {
		try {
			const response = await axios.post("/api/todos", {
				title: newTodo.title,
				status: newTodo.status,
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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
			const foundIndex = todos.findIndex((item) => item._id === id);

			const response = await axios.patch(`/api/todos/${id}?status=${!todos[foundIndex].status}`, null, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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
					authToken: localStorage.getItem("userToken"),
				}
			});
			if (response.status === 200) {
				const updatedTodos = todos.filter(todo => todo._id !== id);
				setTodos(updatedTodos);
			}
			return {data: response.data, error: null}
		} catch (error) {
			return {data: null, error}
		}
	}, [todos]);

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					id="addTodoField"
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
			</form>
			<ul>
				{todos.map((todo) => {
					return <TodoItem
						key={todo._id}
						propId={todo._id}
						propStatus={todo.status}
						propTitle={todo.title}
						propComplete={requestComplete}
						propDelete={requestDelete}
					/>
				})}
			</ul>
		</>
	);
};

export default TodoList;
