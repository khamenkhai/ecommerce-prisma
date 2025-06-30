export class HTTPException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCodes;

    constructor(message: string, errorCode: ErrorCodes, statusCode: number, errors: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIST = 1002,
    INCORRECT_PASWORD = 1003,
    UNPROCESSABLE_ENTITY = 20001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZED = 404,
    ADDRESS_NOT_FOUND = 1004,
    PRODUCT_NOT_FOUND = 1005
}