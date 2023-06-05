import "./App.css";
import {useEffect, useState} from "react";
import axios from "axios";

const App = () => {
	const [todoList, setTodoList] = useState([]);

	useEffect(() => {
		const fetchTodos = async () => {
			const response = await axios.get("https://todolist-online-lw2j.onrender.com/api/todos");
			setTodoList(response.data);
		};
		fetchTodos();
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		const inputField = document.getElementById("addTodoField");
		notifyTodoAdded({
			title: inputField.value,
			status: false,
		});
		inputField.value = "";
	};

	const notifyTodoAdded = async (newTodo) => {
		try {
			const response = await axios.post("https://todolist-online-lw2j.onrender.com/api/todos", {
				title: newTodo.title,
				status: newTodo.status,
			});
			setTodoList(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const notifyTodoComplete = async (id) => {
		try {
			const response = await axios.patch(`https://todolist-online-lw2j.onrender.com/api/todos/${id}?status=true`);
			setTodoList(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const notifyTodoDeleted = async (id) => {
		try {
			const response = await axios.delete(`https://todolist-online-lw2j.onrender.com/api/todos/${id}`);
			setTodoList(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
			<h1>Todo App Lite</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" id="addTodoField"/>
			</form>
			<ul>
				{todoList.map((item) => {
					return (
						<li key={item._id} className="TodoItem">
							<article>
								<input
									type="checkbox"
									onChange={async () => {
										await notifyTodoComplete(item._id);
									}}
									checked={item.status}
								/>
								<h3

								>
									{item.title}
								</h3>
							</article>
							<button onClick={async () => await notifyTodoDeleted(item._id)}>delete</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default App;
