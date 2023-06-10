import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
	username: string;
	password: string;
	salt?: string;
	todos: [{
		title: string;
		completed: boolean;
	}]
}

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: {
			value: true,
			message: "Username is required"
		}
	},
	password: {
		type: String,
		required: {
			value: true,
			message: "Password is required"
		}
	},
	salt: {
		type: String,
		required: false
	},
	todos: {
		type: Array,
		required: true,
	}
});

export const User = mongoose.model<IUser>("User", UserSchema);