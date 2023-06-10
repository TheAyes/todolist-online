import express, {Express, Request, Response} from 'express';
import {join} from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Todo} from './models/Todo.ts';
import {User} from './models/User.ts';
import {config} from 'dotenv';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static(join(__dirname, '../../dist')));

const authenticate = async (req: Request, res: Response): Promise<void> => {
	try {
		const authToken = req.headers.authorization;

		if (!authToken) {
			res.status(401).json({error: 'Authentication token is required'});
			return;
		}

		jwt.verify(authToken, process.env.JWT_SECRET as string);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};

app.get('/', (req: Request, res: Response) => {
	res.sendFile(new URL('../../dist/index.html', import.meta.url).pathname);
});

app.get('/api/todos', authenticate, async (req: Request, res: Response) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.get('/api/todos/:id', authenticate, async (req: Request, res: Response) => {
	try {
		const todo = await Todo.findById(req.params.id);

		if (todo) {
			res.json(todo);
		} else {
			res.status(404).json({error: 'Todo not found'});
		}
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.post('/api/todos', authenticate, async (req: Request, res: Response) => {
	try {
		const {title} = req.body;

		if (!title) {
			res.status(400).json({error: 'Title is required'});
			return;
		}

		const todo = new Todo({
			title,
			status: false,
		});

		await todo.save();
		res.status(201).json(todo);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.patch('/api/todos/:id', authenticate, async (req: Request, res: Response) => {
	try {
		const {id} = req.params;
		const {status} = req.query;

		if (status === undefined) {
			res.status(400).json({error: 'Status is required'});
			return;
		}

		const todo = await Todo.findById(id);

		if (!todo) {
			res.status(404).json({error: 'Todo not found'});
			return;
		}

		todo.status = status === 'true';
		await todo.save();

		res.json(todo);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.delete('/api/todos/:id', authenticate, async (req: Request, res: Response) => {
	try {
		const {id} = req.params;

		const todo = await Todo.findById(id);

		if (!todo) {
			res.status(404).json({error: 'Todo not found'});
			return;
		}

		await Todo.deleteOne({_id: id});

		res.json({message: 'Todo deleted successfully'});
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.post('/api/login', async (req: Request, res: Response) => {
	try {
		const {username, password} = req.body;

		if (!username || !password) {
			res.status(400).json({error: 'Username and password are required'});
			return;
		}

		const user = await User.findOne({username});

		if (!user) {
			res.status(400).json({error: 'Invalid username or password'});
			return;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			res.status(400).json({error: 'Invalid username or password'});
			return;
		}

		const token = jwt.sign(
			{username, passwordHash: user.password},
			process.env.JWT_SECRET as string,
			{expiresIn: '2h'}
		);

		res.status(200).json({token});
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.post('/api/register', async (req: Request, res: Response) => {
	try {
		const {username, password} = req.body;

		if (!username || !password) {
			res.status(400).json({error: 'Username and password are required'});
			return;
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			username,
			password: hashedPassword,
			salt,
		});

		await user.save();

		const token = jwt.sign(
			{username, passwordHash: user.password},
			process.env.JWT_SECRET as string,
			{expiresIn: '2h'}
		);

		res.status(201).json({token, user});
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

app.listen(port, () => {
	console.info(`API is listening on port ${port}`);
});
