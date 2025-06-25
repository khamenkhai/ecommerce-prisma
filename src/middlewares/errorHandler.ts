import { Request, Response, NextFunction } from "express";
import { ErrorCodes, HTTPException } from "../exceptions/root";
import { InternalException } from "../exceptions/internal-exceptions";

export const errorHandler = (method: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            method(req, res, next);
        } catch (error: any) {
            let exception: HTTPException;
            if (error instanceof HTTPException) {
                exception = error;
            } else {
                exception = new InternalException('Something went wrong', error, ErrorCodes.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    }
}