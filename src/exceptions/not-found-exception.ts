import { ErrorCodes, HTTPException } from "./root";


export class NotFoundException extends HTTPException {
    constructor(message: string, errorCode: ErrorCodes) {
        super(message, errorCode, 404, null);
    }
}