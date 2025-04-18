import { generateId } from '../../utils/id-generator';
import type { ClientApi } from '../server-api/api';
import { USER_STATUS } from '../server-api/constants';
import type { Payload } from '../server-api/types/user-actions';
import { getStorageData } from '../storage/storage';

export function openHandler(clientApi: ClientApi): void {
    const id = generateId();
    const payload = null;
    clientApi.sendRequestToServer(USER_STATUS.INACTIVE, payload, String(id));
    clientApi.sendRequestToServer(USER_STATUS.ACTIVE, payload, String(id));
}

export function reloadPage(clientApi: ClientApi): void {
    const id = generateId();
    if (id) {
        const data = getStorageData();
        if (data && 'login' in data && 'password' in data) {
            const payload: Payload = {
                user: {
                    login: String(data.login),
                    password: String(data.password),
                },
            };
            clientApi.sendRequestToServer(USER_STATUS.LOGIN, payload, String(id));
        }
    }
}
