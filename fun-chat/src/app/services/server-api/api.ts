import type { WebSocketConnection } from '../web-socket-connection/web-socket-connection';
import { SessionStorage } from '../storage/storage';
import type { MESSAGE_ACTIONS, USER_MESSAGE_TYPE } from './constants';
import { generateId } from '../../utils/id-generator';
import type { Payload } from './types/user-actions';

export class ClientApi {
    private webSocket: WebSocketConnection;
    private storage: SessionStorage;

    constructor(webSocket: WebSocketConnection) {
        this.webSocket = webSocket;
        this.storage = new SessionStorage();
    }

    public sendRequestToServer(type: USER_MESSAGE_TYPE | MESSAGE_ACTIONS, payload: Payload): void {
        const id = generateId();
        const message = {
            id: id,
            type: type,
            payload: payload,
        };

        this.webSocket.send(message);
    }
}
