import type { InputElement } from '../../components/input/input';
import type { AuthValidator } from '../../services/auth-validator/auth-validator';
import { INPUT_TYPE } from '../../services/auth-validator/constants';

export function loginInputHandlers(inputElement: InputElement, validator: AuthValidator): string | null | undefined {
    const value = inputElement.getValue();

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
