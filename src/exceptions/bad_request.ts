import { ErrorCodes, HTTPException } from "./root";

export class BadRequestsException extends HTTPException {
    constructor(message: string, errorCode: ErrorCodes) {
        super(message, errorCode, 400, null);
    }
}