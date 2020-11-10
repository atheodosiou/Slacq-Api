import { StatusCodeExplanation } from "../enums/statusCodeExplanation.enum";

export interface IError {
    statusCode: number;
    message: StatusCodeExplanation;
    details?: any
}