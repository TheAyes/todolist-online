import {NextFunction, Request, Response} from "express";
import {LocalStorage} from "node-localstorage";
import {User} from "./models/User.js";

const localStorage = new LocalStorage('./scratch');

export const incrementInteractionCount = async (req: Request, res: Response, next: NextFunction) => {
	const interactionCount = Number(localStorage.getItem('interactionCount')) || 0;
	localStorage.setItem('interactionCount', String(interactionCount + 1));
	next();
};

export const getInteractionCount = async (req: Request, res: Response) => {
	const interactionCount = Number(localStorage.getItem('interactionCount')) || 0;
	res.json({interactionCount: interactionCount});
}

export const getUserCount = async (req: Request, res: Response) => {
	const users = await User.find().exec();
	res.json({userCount: users.length});
}