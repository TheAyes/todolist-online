import {NextFunction, Request, Response} from "express";

export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
	const safetyPattern = /^[a-zA-Z0-9_ .!?\-@&\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF ]*$/;

	if (req.body) {
		for (const key in req.body) {
			if (typeof req.body[key] === 'string') {
				req.body[key] = req.body[key].trim();

				// Reset lastIndex property for RegExp object with 'g' flag
				safetyPattern.lastIndex = 0;

				if (!safetyPattern.test(req.body[key])) {
					res.status(400).json({error: 'Invalid characters in body'});
					return;
				}
			}
		}
	}
	next();
};