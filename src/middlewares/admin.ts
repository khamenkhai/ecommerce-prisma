import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized-exceptions";
import { ErrorCodes } from "../exceptions/root";

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("[adminMiddleware] Checking user role...");
    console.log(`[adminMiddleware] User info: ${JSON.stringify(user)}`);

    if (user?.role === "ADMIN") {
        console.log("[adminMiddleware] Access granted: User is ADMIN");
        next();
    } else {
        console.warn("[adminMiddleware] Access denied: User is not ADMIN");
        next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }
};

export default adminMiddleware;
