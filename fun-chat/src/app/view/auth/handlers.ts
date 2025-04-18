import type { Button } from '../../components/buttons/buttons';
import type { InputElement } from '../../components/input/input';
import type { AuthValidator } from '../../services/auth-validator/auth-validator';
import { EMPTY, INPUT_TYPE } from '../../services/auth-validator/constants';
import type { Payload, User } from '../../services/server-api/types/user-actions';
import type { ClientApi } from '../../services/server-api/api';
import { USER_STATUS } from '../../services/server-api/constants';

export function loginHandler(
    loginElement: InputElement,
    validator: AuthValidator,
    btn: Button
): string | null | undefined {
    const value = loginElement.getValue();

    if (!value) {
        return EMPTY;
    }

    if (value) {
        let errorMessage: string | null = null;

        const minLengthCheck = validator.checkMinLength(value, INPUT_TYPE.LOGIN);
        if (typeof minLengthCheck === 'string') {
            errorMessage = minLengthCheck;
        } else {
            const maxLengthCheck = validator.checkMaxLength(value, INPUT_TYPE.LOGIN);
            if (typeof maxLengthCheck === 'string') {
                errorMessage = maxLengthCheck;
            } else {
                const emptyCheck = validator.checkIsEmpty(value);
                if (typeof emptyCheck === 'string') {
                    errorMessage = emptyCheck;
                }
            }
        }
        return errorMessage;
    }

    return;
}

export function passwordHandler(
    passwordElement: InputElement,
    validator: AuthValidator,
    btn: Button
): string | null | undefined {
    const value = passwordElement.getValue();

    if (!value) {
        return EMPTY;
    }

    if (value) {
        let errorMessage: string | null = null;

        const minLengthCheck = validator.checkMinLength(value, INPUT_TYPE.PASSWORD);
        if (typeof minLengthCheck === 'string') {
            errorMessage = minLengthCheck;
        } else {
            const maxLengthCheck = validator.checkMaxLength(value, INPUT_TYPE.PASSWORD);
            if (typeof maxLengthCheck === 'string') {
                errorMessage = maxLengthCheck;
            } else {
                const emptyCheck = validator.checkIsEmpty(value);
                if (typeof emptyCheck === 'string') {
                    errorMessage = emptyCheck;
                }
            }
        }
        return errorMessage;
    }
    return;
}
