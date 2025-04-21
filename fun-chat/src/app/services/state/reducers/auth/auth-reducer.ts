import { Modal } from '../../../../components/modal/modal';
import { APP_ERROR } from '../../../server-api/constants';

export let isAccessDenied = true;

export function checkErrors(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    console.log(payload);

    if (type === APP_ERROR.ERROR) {
        const error: string = payload.error;
        isAccessDeniedToggler(false);
        const modal = new Modal();
        modal.showModal(error);
        
    }
}

export function isAccessDeniedToggler(value: boolean): void {
    isAccessDenied = value;
}
