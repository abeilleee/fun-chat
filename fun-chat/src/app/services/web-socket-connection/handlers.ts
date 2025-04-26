import { USER_STATUS } from '../client-api/constants';
import { getCurrentUsername, getPassword, isLogined } from '../storage/storage';
import type { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import type { ClientApi } from '../client-api/client-api';
import type { Payload } from '../client-api/types/user';

export function openHandler(clientApi: ClientApi): void {
    const currentUserLogin = getCurrentUsername();
    const currentUserPassword = getPassword();
    const isAuth = isLogined();

    if (currentUserLogin && currentUserPassword && isAuth) {
        const payload: Payload = {
            user: {
                login: currentUserLogin,
                password: currentUserPassword,
            },
        };

        clientApi.sendRequestToServer(USER_STATUS.LOGIN, payload);
        clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null);
        clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null);
    }
}

export function closeHandler(waiter: ConnectionWaiter): void {
    addEventListener('connectionClosed', () => {
        if (!waiter.isOpen) waiter.showWaiter();
    });
}
