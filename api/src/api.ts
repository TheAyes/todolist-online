import express, {Express, Request, Response} from 'express';
import path, {dirname, join} from 'path';
import {config} from 'dotenv';
import {createTodo, deleteTodo, getAllTodos, getOneTodo, updateTodo} from "./TodoController.ts";
import * as process from "process";
import {
	authenticateUser,
	handleTokenRefresh,
	handleUserLogin,
	handleUserRegistration
} from "./AuthenticationController.ts";
import {fileURLToPath} from "url";
import mongoose from "mongoose";
import * as fs from "fs";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
const port = process.env.API_PORT || 3000;

app.use(express.static(join(__dirname, '../../dist/client')));
app.use(express.json());

await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`)


app.get('/api/todos', authenticateUser, async (req: Request, res: Response) => {

	await getAllTodos(req, res);
});

app.get('/api/todos/:id', authenticateUser, async (req: Request, res: Response) => {
	await getOneTodo(req, res);
});

app.post('/api/todos', authenticateUser, async (req: Request, res: Response) => {
	await createTodo(req, res);
});

app.patch('/api/todos/:id', authenticateUser, async (req: Request, res: Response) => {
	await updateTodo(req, res);
});

app.delete('/api/todos/:id', authenticateUser, async (req: Request, res: Response) => {
	await deleteTodo(req, res);
});

app.post('/api/login', async (req: Request, res: Response) => {
	await handleUserLogin(req, res);
});

app.post('/api/register', async (req: Request, res: Response) => {
	await handleUserRegistration(req, res);
});

app.post('/api/refresh', async (req: Request, res: Response) => {
	await handleTokenRefresh(req, res);
});

app.get("api/visits", async (req: Request, res: Response) => {
	const visits = fs.readFileSync("visits.txt", "utf-8");
});

app.get('*', (req: Request, res: Response) => {
	const filePath = path.join(__dirname, '../../dist/client/index.html');
	res.sendFile(filePath);
});

app.listen(port, () => {
	console.info(`API is listening on port ${port}`);
});
