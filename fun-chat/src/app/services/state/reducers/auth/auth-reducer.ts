import { Modal } from '../../../../components/modal/modal';
import { APP_ERROR } from '../../../server-api/constants';

export function checkErrors(data: string): void {
    const { id, type, payload } = JSON.parse(data);

    if (type === APP_ERROR.ERROR) {
        const error: string = payload.error;
        const modal = new Modal();
        modal.showModal(error);
    }
}
