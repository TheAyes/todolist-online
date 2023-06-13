import {User} from './models/User.js';
import bcrypt from 'bcrypt';
import {NextFunction, Request, Response} from 'express';
import {authenticate, generateToken, refreshToken} from "jwt-authorize";
import * as process from "process";

declare global {
	namespace Express {

		interface Request {
			user?: any;
		}
	}
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
	const authHeader = req.get('Authorization') || req.get('authorization');
	const token = authHeader && authHeader.split(' ')[1];


	if (!token) {
		return res.status(401).json({error: 'Unauthorized'});
	}

	const authResult = authenticate({
		accessToken: token,
	}, process.env.JWT_SECRET!);

	if (authResult.isAuthenticated) {
		req.user = await User.findById(authResult.payload?.userid).exec();
		next();
	} else {
		return res.status(authResult.status!).json({error: authResult.error});
	}
};

export const doesUserExist = async (username: string = ''): Promise<boolean> => {
	const foundUser = await User.findOne({username}).exec();

	return !!foundUser;
};

// Modified handleUserRegistration function to generate refresh tokens
export const handleUserRegistration = async (req: Request, res: Response) => {
	const usernamePattern = /^[a-zA-Z0-9_-]{3,26}$/;
	const {username, password} = req.body;

	if (!usernamePattern.test(username)) return res.status(400).json({
		accessToken: null,
		refreshToken: null,
		error: 'Invalid username'
	});

	const lowerCaseUsername = username.toLowerCase();
	try {
		if (await doesUserExist(lowerCaseUsername)) {
			return res.status(409).json({
				accessToken: null,
				refreshToken: null,
				error: 'User already exists'
			});
		}

		const userSalt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, userSalt);

		const user = new User({
			username: lowerCaseUsername,
			password: hashedPassword,
		});

		const savedUser = await user.save();

		const result = generateToken(
			{
				payload: {userid: savedUser._id, hashedPassword: hashedPassword},
				secret: process.env.JWT_SECRET!,
				options: {expiresIn: '15m'}
			},
			{
				payload: {userid: savedUser._id, hashedPassword: hashedPassword},
				secret: process.env.JWT_REFRESH_SECRET!,
				options: {expiresIn: '7d'}
			}
		);

		return res.status(201).json({
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
			error: null
		});
	} catch (err: any) {
		console.error(err)
		return res.status(500).json({accessToken: null, refreshToken: null, user: null, error: err.message});
	}
};


export const handleUserLogin = async (req: Request, res: Response) => {
	const {username, password} = req.body;
	try {
		const foundUser = await User.findOne({username}).exec();
		if (!foundUser) {
			return res.status(401).json({
				accessToken: null,
				refreshToken: null,
				error: 'Invalid username or password'
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				accessToken: null,
				refreshToken: null,
				user: null,
				error: 'Invalid username or password'
			});
		}

		const result = generateToken(
			{
				payload: {userid: foundUser._id, hashedPassword: foundUser.password},
				secret: process.env.JWT_SECRET!,
				options: {expiresIn: '15m'}
			},
			{
				payload: {userid: foundUser._id, hashedPassword: foundUser.password},
				secret: process.env.JWT_REFRESH_SECRET!,
				options: {expiresIn: '7d'}
			}
		);

		return res.status(200).json({
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
			error: null
		});

	} catch (err: any) {
		return {accessToken: null, refreshToken: null, user: null, error: err.message};
	}
};

export const handleTokenRefresh = async (req: Request, res: Response) => {
	const authHeader = req.get('Authorization') || req.get('authorization');
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json({error: 'Token is required'});
	}

	const refreshSecret = process.env.JWT_REFRESH_SECRET;
	const jwtSecret = process.env.JWT_SECRET;

	if (!refreshSecret || !jwtSecret) {
		return res.status(500).json({error: 'Server configuration error'});
	}

	const result = refreshToken(
		token,
		refreshSecret,
		(payload) => {
			return payload;
		},
		true
	);

	// Handling the result of refreshToken
	if (result.status === 200) {
		return res.json({
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		});
	} else {
		return res.status(result.status!).json({error: result.error});
	}
};