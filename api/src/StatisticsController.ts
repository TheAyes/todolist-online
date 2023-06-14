import {NextFunction, Request, Response} from "express";
import {LocalStorage} from "node-localstorage";
import {User} from "./models/User.js";
import {Statistics} from "./models/Statistics.js";

const localStorage = new LocalStorage('./scratch');

export const incrementInteractionCount = async (req: Request, res: Response, next: NextFunction) => {
	const statistics = await Statistics.findOne().exec()


	next();
};

export const getInteractionCount = async (req: Request, res: Response) => {

	const statistics = await Statistics.findOne().exec() //Number(localStorage.getItem('interactionCount')) || 0;

	if (!statistics) return res.json({interactionCount: 0});

	res.json(statistics.interactionCount);
}

export const getUserCount = async (req: Request, res: Response) => {
	const users = await User.find().exec();
	res.json({userCount: users.length});
}