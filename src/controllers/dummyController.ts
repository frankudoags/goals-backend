import { Request, Response } from 'express';

export const homeHandler = (req: Request, res: Response) => {
    res.send('Hello World!');
};
    