import {Request, Response} from "express";
import {IUser, User} from "./models/User.js";

const getUser = async (req: Request, res: Response) => {
	try {
		const {user} = req;

		if (!user) {
			res.status(401).json({error: 'Unauthorized'});
			return;
		}

		const foundUser = await User.findOne<IUser>({username: user.username}).exec();

		if (!foundUser) {
			res.status(404).json({error: 'User not found'});
			return;
		}

		return user
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};

export const getAllTodos = async (req: Request, res: Response) => {
	const user = await getUser(req, res);

	res.json(user.todos);
}

export const getOneTodo = async (req: Request, res: Response) => {
	const user = await getUser(req, res);

	res.json(user.todos.filter((id: Number) => {
		return id === Number(req.params.id);
	}));
}

export const createTodo = async (req: Request, res: Response) => {
	const user = await getUser(req, res);

	const {title, description} = req.body;

	if (!title || !description) {
		res.status(400).json({error: 'Title and description are required'});
		return;
	}

	const todo = {
		title,
		description,
		status: false
	};

	user.todos.push(todo);

	await user.save();

	res.json(user.todos);
}

export const updateTodo = async (req: Request, res: Response) => {
	const user = await getUser(req, res);

	const {id} = req.params;
	const {status} = req.query;

	if (status === undefined) {
		res.status(400).json({error: 'Status is required'});
		return;
	}

	const todo = user.todos.find((todo: any) => {
		return todo._id === id;
	});

	if (!todo) {
		res.status(404).json({error: 'Todo not found'});
		return;
	}

	todo.status = status === 'true';
	await user.save();

	res.json(todo);
}

export const deleteTodo = async (req: Request, res: Response) => {
	const user = await getUser(req, res);

	const {id} = req.params;

	const todoIndex = user.todos.findIndex((todo: any) => {
		return todo._id === id;
	});

	if (todoIndex === -1) {
		res.status(404).json({error: 'Todo not found'});
		return;
	}

	user.todos.splice(todoIndex, 1);
	await user.save();

	res.json(user.todos);
}