import { ErrorCodes, HTTPException } from "./root";

export class UnauthorizedException extends HTTPException {
    constructor(message: string, errorCode: ErrorCodes) {
        super(message, errorCode, 401, null);
    }
}
