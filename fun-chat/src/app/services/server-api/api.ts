import type { WebSocketConnection } from '../web-socket-connection/web-socket-connection';
import type { MESSAGE_ACTIONS, USER_STATUS } from './constants';
import type { Payload } from './types/user-actions';

export class ClientApi {
    constructor() {}

    public sendRequestToServer(type: USER_STATUS | MESSAGE_ACTIONS, payload: Payload, id: string): void {
        const message = {
            id: id,
            type: type,
            payload: payload,
        };

        // this.webSocket.send(message);
    }
}
