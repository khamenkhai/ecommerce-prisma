import { HTTPException } from "./root";

export class UnprocessableEntity extends HTTPException {
    constructor(errors: any, message: string, errorCode: number) {
        super(message, errorCode, 422, errors);
    }
}