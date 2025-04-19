import { ClientApi } from '../server-api/api';
import type { ServerMessage } from '../server-api/types/server-actions';
import { getMessages } from '../state/reducers/dialog/dialog-reducer';
import { getUsers } from '../state/reducers/users/user-states-reducer';
import { EVENT_TYPE, SERVER_URL } from './constants';
import { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import { connectionClosed, connectionOpen } from '../custom-events/custom-events';
import { closeHandler, openHandler } from './handlers';

export class WebSocketConnection {
    public isOpen: boolean = false;
    private websocket: WebSocket | null = null;
    private clientApi: ClientApi;
    private connectionWaiter: ConnectionWaiter;

    constructor() {
        this.clientApi = new ClientApi();
        this.openConnection();
        this.connectionWaiter = new ConnectionWaiter();
        closeHandler(this.connectionWaiter);
    }

    public send(message: ServerMessage): void {
        this.websocket?.send(JSON.stringify(message));
    }

    public setEventListener(eventType: EVENT_TYPE, callback: () => void): void {
        this.websocket?.addEventListener(eventType, callback);
    }

    public removeEventListener(event: string, callback: () => void): void {
        this.websocket?.removeEventListener(event, callback);
    }

    private openConnection(): void {
        this.websocket = new WebSocket(SERVER_URL);

        this.websocket.addEventListener(EVENT_TYPE.OPEN, () => {
            this.isOpen = true;
            if (this.connectionWaiter.isOpen) {
                this.connectionWaiter.hideWaiter();
            }

            openHandler(this.connectionWaiter);
            dispatchEvent(connectionOpen);
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, () => {});
        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, (message: MessageEvent) => {
                const response = message.data;
                getUsers(response);
                getMessages(response);
            });
            this.websocket.addEventListener(EVENT_TYPE.CLOSE, () => {
                this.isOpen = false;
                dispatchEvent(connectionClosed);

                setTimeout(() => {
                    this.openConnection();
                }, 1000);
            });
        }
    }
}
