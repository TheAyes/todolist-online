import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	status: {
		id: String,
		type: Boolean,
		required: false,
	}
});

export const Todo = mongoose.model("Todo", TodoSchema);