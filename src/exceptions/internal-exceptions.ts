import { HTTPException } from "./root";

export class InternalException extends HTTPException {
    constructor(message: string, errors: any, errorCode: number) {
        super(message, errorCode, 500, errors);
    }
}