import {Request, Response} from "express";
import {v4 as uuid} from 'uuid';


export const getAllTodos = async (req: Request, res: Response) => {
	const {user} = req;
	res.json(user.todos);
}

export const getOneTodo = async (req: Request, res: Response) => {
	const {user} = req;

	res.json(user.todos.filter((id: Number) => {
		return id === Number(req.params.id);
	}));
}

export const createTodo = async (req: Request, res: Response) => {
	const {user} = req;

	const {title} = req.body;

	if (!title) {
		res.status(400).json({error: 'Title and description are required'});
		return;
	}

	const todo = {
		id: uuid(),
		title,
		status: false
	};

	user.todos.push(todo);

	await user.save();

	res.json(todo);
}

export const updateTodo = async (req: Request, res: Response) => {
	const {user} = req;

	const {id} = req.params;
	const {status} = req.query;

	if (status === undefined) {
		res.status(400).json({error: 'Status is required'});
		return;
	}

	const todoIndex = user.todos.findIndex((todo: any) => {
		return todo.id === id;
	});

	if (!todoIndex) {
		res.status(404).json({error: 'Todo not found'});
		return;
	}

	user.todos[todoIndex].status = status === 'true';

	await user.save();

	res.json(user.todos[todoIndex]);
}

export const deleteTodo = async (req: Request, res: Response) => {
	const {user} = req;

	const {id} = req.params;

	const todoIndex = user.todos.findIndex((todo: any) => {
		return todo.id === id;
	});

	if (todoIndex === -1) {
		res.status(404).json({error: 'Todo not found'});
		return;
	}

	user.todos.splice(todoIndex, 1);
	await user.save();

	res.json(user.todos);
}