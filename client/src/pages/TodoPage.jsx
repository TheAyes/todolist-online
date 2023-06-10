import React from 'react';
import styles from './TodoPage.module.scss'
import TodoList from "../components/TodoList.jsx";

const TodoPage = () => {
	return (
		<div className={styles.TodoPage}>
			<TodoList/>
		</div>
	);
};

export default TodoPage;
