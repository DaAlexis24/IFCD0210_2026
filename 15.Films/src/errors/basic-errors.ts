import { HttpError } from "./http-error.ts";

export const INTERNAL_ERROR = new HttpError(
    500,
    'Internal Server Error',
    'An unexpected error occurred while processing the request',
);

export const NOT_FOUND_ERROR = new HttpError(
    404,
    'Not Found',
    'The requested resource was not found',
);
