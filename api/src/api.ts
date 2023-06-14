import express, {Express, Request, Response} from 'express';
import path, {dirname, join} from 'path';
import {config} from 'dotenv';
import {createTodo, deleteTodo, getAllTodos, getOneTodo, updateTodo} from "./TodoController.js";
import * as process from "process";
import {
	authenticateUser,
	getUserData,
	handleTokenRefresh,
	handleUserLogin,
	handleUserLogout,
	handleUserRegistration
} from "./AuthenticationController.js";
import {fileURLToPath} from "url";
import mongoose from "mongoose";
import {getInteractionCount, getUserCount, incrementInteractionCount} from "./StatisticsController.js";
import {sanitizeBody} from "./SecurityController.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
const port = process.env.API_PORT || 3000;

app.use(express.static(join(__dirname, '../../dist/client')));
app.use(express.json());

await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`)


app.get('/api/todos', authenticateUser, incrementInteractionCount, async (req: Request, res: Response) => {

	await getAllTodos(req, res);
});

app.get('/api/todos/:id', authenticateUser, incrementInteractionCount, async (req: Request, res: Response) => {
	await getOneTodo(req, res);
});

app.post('/api/todos', authenticateUser, sanitizeBody, incrementInteractionCount, async (req: Request, res: Response) => {
	await createTodo(req, res);
});

app.patch('/api/todos/:id', authenticateUser, incrementInteractionCount, async (req: Request, res: Response) => {
	await updateTodo(req, res);
});

app.delete('/api/todos/:id', authenticateUser, incrementInteractionCount, async (req: Request, res: Response) => {
	await deleteTodo(req, res);
});

app.post('/api/login', incrementInteractionCount, async (req: Request, res: Response) => {
	await handleUserLogin(req, res);
});

app.post('/api/register', incrementInteractionCount, async (req: Request, res: Response) => {
	await handleUserRegistration(req, res);
});

app.post('/api/refresh', async (req: Request, res: Response) => {
	await handleTokenRefresh(req, res);
});

app.get("/api/user", authenticateUser, incrementInteractionCount, async (req: Request, res: Response) => {
	await getUserData(req, res);
});

app.post("/api/logout", async (req: Request, res: Response) => {
	await handleUserLogout(req, res);
});

app.get("/api/statistics/interactions", async (req: Request, res: Response) => {
	await getInteractionCount(req, res);
});

app.get("/api/statistics/users", async (req: Request, res: Response) => {
	await getUserCount(req, res);
});

app.get('*', (req: Request, res: Response) => {
	const filePath = path.join(__dirname, '../../dist/client/index.html');
	res.sendFile(filePath);
});

app.listen(port, () => {
	console.info(`API is listening on port ${port}`);
});
