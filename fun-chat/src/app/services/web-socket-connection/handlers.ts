import type { ClientApi } from '../server-api/api';
import { USER_STATUS } from '../server-api/constants';
import { getStorageData } from '../storage/storage';

export function openHandler(clientApi: ClientApi): void {
    const data = getStorageData();
    let id: unknown = '';

    if (data && 'id' in data) {
        id = data.id;
    }
    const payload = null;
    clientApi.sendRequestToServer(USER_STATUS.INACTIVE, payload, String(id));
    clientApi.sendRequestToServer(USER_STATUS.ACTIVE, payload, String(id));
}
