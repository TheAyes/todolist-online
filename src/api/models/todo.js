import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		required: false,
	}
});

export const Todo = mongoose.model("Todo", TodoSchema);