export enum VALID_LOGIN_PARAMS {
    MIN_LENGTH = 3,
    MAX_LENGTH = 16,
}

export enum VALID_PASSWORD_PARAMS {
    MIN_LENGTH = 5,
    MAX_LENGTH = 12,
}

export enum ERROR_MESSAGES {
    SHORT = 'The length must be at least',
    LONG = 'The length should be no more than',
    REQUIRED = 'The field is required',
    LETTERS = 'The password must contain at least 1 uppercase letter',
}
