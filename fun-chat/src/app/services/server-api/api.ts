import type { WebSocketConnection } from '../web-socket-connection/web-socket-connection';
import type { MESSAGE_ACTIONS, USER_STATUS } from './constants';
import { generateId } from '../../utils/id-generator';
import type { Payload } from './types/user-actions';

export class ClientApi {
    private webSocket: WebSocketConnection;

    constructor(webSocket: WebSocketConnection) {
        this.webSocket = webSocket;
    }

    public sendRequestToServer(type: USER_STATUS | MESSAGE_ACTIONS, payload: Payload, id: string): void {
        const message = {
            id: id,
            type: type,
            payload: payload,
        };

        this.webSocket.send(message);
    }
}
