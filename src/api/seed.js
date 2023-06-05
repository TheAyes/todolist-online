import mongoose from "mongoose";
import {Todo} from "./models/todo.js";

await mongoose.connect(`mongodb+srv://todo-api:KVdbT6lULorVweOo@cluster0.af829yt.mongodb.net/?retryWrites=true&w=majority`);

const todoData = [
	new Todo({
		title: "Learn NodeJS",
		status: false
	}),
	new Todo({
		title: "Learn ExpressJS",
		status: false
	}),
	new Todo({
		title: "Learn MongoDB",
		status: false
	}),
	new Todo({
		title: "Learn ReactJS",
		status: false
	}),
	new Todo({
		title: "Learn GraphQL",
		status: false
	})
];

await Promise.all(todoData.map(todo => todo.save()));


await mongoose.disconnect();