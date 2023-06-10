import {User} from './models/User.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {NextFunction, Request, Response} from 'express';

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

interface UserPayload {
	username: string;
	passwordHash: string;
}

export const generateToken = (username: string, passwordHash: string): string => {
	return jwt.sign({username, passwordHash}, process.env.JWT_SECRET!, {expiresIn: '24h'});
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void | Response => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({error: 'Unauthorized'});
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).json({error: 'Internal server error'});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
		if (err) {
			return res.status(403).json({error: 'Forbidden'});
		}

		req.user = user;
		next();
	});
};

export const doesUserExist = async (username: string = '', password: string = ''): Promise<boolean> => {
	if (!username || !password) {
		throw new Error('Username and password are required');
	}

	const foundUser = await User.findOne({username}).exec();

	return !!foundUser;
};

export const handleUserRegistration = async (username: string, password: string) => {
	try {
		if (await doesUserExist(username, password)) {
			return {token: null, user: null, error: 'User already exists'};
		}

		const userSalt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, userSalt);

		const user = new User({
			username,
			password: hashedPassword,
			salt: userSalt
		});

		await user.save();

		const token = generateToken(username, user.password);

		return {token, user, error: null};
	} catch (err: any) {
		return {token: null, user: null, error: err.message};
	}
};

export const handleUserLogin = async (username: string, password: string) => {
	try {
		// login logic here
	} catch (err: any) {
		return {token: null, user: null, error: err.message};
	}
};
