import type { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import { generateId } from '../../utils/id-generator';
import type { ClientApi } from '../server-api/client-api';
import { USER_STATUS } from '../server-api/constants';
import type { Payload } from '../server-api/types/user';
import { dialogState } from '../state/reducers/dialog/dialog-reducer';
import { allUsers } from '../state/reducers/users/user-states-reducer';
import { getCurrentUsername, getPassword, isLogined } from '../storage/storage';

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

        setTimeout(() => {
            allUsers.active;
        });
    }
}

export function closeHandler(waiter: ConnectionWaiter): void {
    addEventListener('connectionClosed', () => {
        if (!waiter.isOpen) waiter.showWaiter();
    });
}
