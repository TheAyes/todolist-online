import React from 'react';
import styles from './TodoItem.module.scss'

const TodoItem = ({propTitle = "no title", propStatus = false, propId = "", propComplete, propDelete}) => {

	return (
		<li className={styles.TodoItem}>
			<article>
				<input
					type="checkbox"
					checked={propStatus}
					onChange={() => {
						propComplete(propId)
					}}
				/>
				<h3>{propTitle}</h3>
			</article>
			<button onClick={() => {
				propDelete(propId)
			}}>
				delete
			</button>
		</li>
	);
};

export default TodoItem;
