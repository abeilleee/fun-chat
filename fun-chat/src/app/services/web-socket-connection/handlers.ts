import type { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import { generateId } from '../../utils/id-generator';
import { ClientApi } from '../server-api/api';
import { USER_STATUS } from '../server-api/constants';
import type { Payload } from '../server-api/types/user-actions';
import { getCurrentUsername, getStorageData } from '../storage/storage';
import type { WebSocketConnection } from './web-socket-connection';

export function openHandler(waiter: ConnectionWaiter): void {
    console.log('OPEN CONNECTION');
    const clientApi = new ClientApi();

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

export function closeHandler(waiter: ConnectionWaiter): void {
    addEventListener('connectionClosed', () => {
        if (!waiter.isOpen) waiter.showWaiter();
    });
}

export function checkServer(websocket: WebSocket): boolean | undefined {
    if (websocket instanceof WebSocket) {
        console.log('check server: ', websocket.readyState !== 2 && websocket.readyState !== 3);
        return websocket.readyState !== 2 && websocket.readyState !== 3;
    }
}
