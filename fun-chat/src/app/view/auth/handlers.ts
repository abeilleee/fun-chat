import type { InputElement } from '../../components/input/input';
import type { AuthValidator } from '../../services/auth-validator/auth-validator';
import { EMPTY, INPUT_TYPE } from '../../services/auth-validator/constants';

export function loginHandler(loginElement: InputElement, validator: AuthValidator): string | undefined {
    const value = loginElement.getValue();

    if (!value) {
        return EMPTY;
    }

    const validationResults = [
        validator.checkMinLength(value, INPUT_TYPE.LOGIN),
        validator.checkMaxLength(value, INPUT_TYPE.LOGIN),
        validator.checkIsEmpty(value),
    ];

    return validationResults.find((error) => typeof error === 'string');
}

export function passwordHandler(passwordElement: InputElement, validator: AuthValidator): string | null | undefined {
    const value = passwordElement.getValue();

    if (!value) {
        return EMPTY;
    }

    const validationResults = [
        validator.checkMinLength(value, INPUT_TYPE.LOGIN),
        validator.checkMaxLength(value, INPUT_TYPE.LOGIN),
        validator.checkIsEmpty(value),
        validator.checkRequiredLetters(value),
    ];

    return validationResults.find((error) => typeof error === 'string');
}
