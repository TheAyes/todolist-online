import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		required: false,
	},
	authToken: {
		type: String,
		required: true
	}
});

export const Todo = mongoose.model("Todo", TodoSchema);