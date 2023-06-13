import React from 'react';
import styles from './TodoPage.module.scss'
import TodoList from "../components/TodoStuff/TodoList.jsx";

const TodoPage = () => {
	return (
		<main className={styles.TodoPage}>
			<TodoList/>
		</main>
	);
};

export default TodoPage;
