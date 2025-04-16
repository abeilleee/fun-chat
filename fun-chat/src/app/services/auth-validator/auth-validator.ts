import type { Button } from '../../components/buttons/buttons';
import { ERROR_MESSAGES, INPUT_TYPE, VALID_LOGIN_PARAMS, VALID_PASSWORD_PARAMS } from './constants';

export class AuthValidator {
    constructor() {}

    public checkMinLength(value: string, type: INPUT_TYPE): string | boolean {
        //|| value.trim().length === 0
        const targetLength =
            type === INPUT_TYPE.LOGIN ? VALID_LOGIN_PARAMS.MIN_LENGTH : VALID_PASSWORD_PARAMS.MIN_LENGTH;

        const option = type === INPUT_TYPE.LOGIN ? value.trim().length : value.length;

        if (value.length < +targetLength) {
            console.log('length: ', value.length);
            const errorMessage = `${ERROR_MESSAGES.SHORT} ${targetLength} characters`;
            return errorMessage;
        }
        return true;
    }

    public checkMaxLength(value: string, type: INPUT_TYPE): string | boolean {
        const targetLength =
            type === INPUT_TYPE.LOGIN ? VALID_LOGIN_PARAMS.MAX_LENGTH : VALID_PASSWORD_PARAMS.MAX_LENGTH;

        const option = type === INPUT_TYPE.LOGIN ? value.trim().length : value.length;

        if (value.length > +targetLength) {
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
        if (this.checkMinLength(password, INPUT_TYPE.PASSWORD) && this.checkMaxLength(password, INPUT_TYPE.PASSWORD)) {
            const uppercaseRegex = /A-Z/;
            if (!uppercaseRegex.test(password)) {
                return ERROR_MESSAGES.LETTERS;
            }
            return true;
        }
    }

    public checkValid(loginIsValid: boolean, passwordIsValid: boolean, btn: Button): void {
        if (loginIsValid && passwordIsValid) {
            btn.setDisabled(false);
            return;
        }
        btn.setDisabled(true);
    }
}
