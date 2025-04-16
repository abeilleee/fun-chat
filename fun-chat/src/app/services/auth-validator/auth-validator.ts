import { ERROR_MESSAGES, VALID_LOGIN_PARAMS, VALID_PASSWORD_PARAMS } from './constants';

export class AuthValidator {
    constructor() {}

    public checkMinLength(targetLength: number, value: string): string | boolean {
        //|| value.trim().length === 0
        if (value.trim().length < +VALID_LOGIN_PARAMS.MIN_LENGTH) {
            const errorMessage = `${ERROR_MESSAGES.SHORT} ${targetLength} characters`;
            return errorMessage;
        }
        return true;
    }

    public checkMaxLength(targetLength: number, value: string): string | boolean {
        if (value.length > +VALID_LOGIN_PARAMS.MAX_LENGTH || value.trim().length === 0) {
            const errorMessage = `${ERROR_MESSAGES.LONG} ${targetLength} characters`;
            return errorMessage;
        }
        return true;
    }

    public checkIsEmpty(value: string): string | boolean {
        if (value.length === 0 || value.trim().length === 0) {
            const errorMessage = ERROR_MESSAGES.REQUIRED;
            return errorMessage;
        }
        return true;
    }

    public checkRequiredLetters(password: string): string | boolean | undefined {
        if (
            this.checkMinLength(VALID_PASSWORD_PARAMS.MIN_LENGTH, password) &&
            this.checkMaxLength(VALID_PASSWORD_PARAMS.MAX_LENGTH, password)
        ) {
            const uppercaseRegex = /A-Z/;
            if (!uppercaseRegex.test(password)) {
                return ERROR_MESSAGES.LETTERS;
            }
            return true;
        }
    }
}
