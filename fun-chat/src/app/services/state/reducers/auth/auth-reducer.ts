import { Modal } from '../../../../components/modal/modal';
import { APP_ERROR } from '../../../server-api/constants';
import { ERRORS } from '../../types';

export function checkErrors(data: string): void {
    const { id, type, payload } = JSON.parse(data);

    if (type === APP_ERROR.ERROR) {
        const error: string = payload.error;

        if (
            error === String(ERRORS.DOUBLE_LOGIN) ||
            error === String(ERRORS.DOUBLE_USER) ||
            error === String(ERRORS.INCORRECT_PASSWORD)
        ) {
            const modal = new Modal();
            modal.showModal(error);
        } else {
            console.error(error);
        }
    }
}
