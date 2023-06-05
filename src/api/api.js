// import express from "express";
import express from 'express';
import mongoose from "mongoose";
import {Todo} from "./models/todo.js";
import cors from "cors";
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3200;
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.af829yt.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(connectionString);

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, '../../dist')));

app.get("/", (req, res) => {
	res.sendFile(import.meta.url + "../../dist/index.html");
});

app.get("/api/todos", async (req, res) => {
	const result = await Todo.find();
	return res.json(result);
});

app.post("/api/todos", async (req, res) => {
	const {title} = req.body;
	const todo = new Todo({
		title,
		status: false
	});
	await todo.save();

	const result = await Todo.find();
	res.json(result);
});

app.patch("/api/todos/:id", async (req, res) => {
	const {id} = req.params;
	const {status} = req.query;

	const todo = await Todo.findById(id);
	todo.status = status;
	await todo.save();

	const result = await Todo.find();
	res.json(result);
});

app.delete("/api/todos/:id", async (req, res) => {
	const {id} = req.params;

	await Todo.deleteOne({_id: id});

	const result = await Todo.find();
	res.json(result);
});

app.listen(port, () => {
	console.info(`API is listening on port ${port}`);
});