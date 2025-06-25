import { NextFunction, Request, Response } from "express";
import { HTTPException } from "../exceptions/root";

export const errorMiddleware = (error: HTTPException, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    });
}