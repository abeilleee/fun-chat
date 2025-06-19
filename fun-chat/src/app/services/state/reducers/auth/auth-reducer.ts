import { Modal } from '../../../../components/modal/modal';
import { APP_ERROR } from '../../../client-api/constants';
import { ServerMessage } from '../../../client-api/types/server';
import { ERRORS } from '../../types';

export function checkErrors(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { type, payload } = parsedData;

    if (type === APP_ERROR.ERROR) {
        const error: string = payload.error ? payload.error : '';

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
