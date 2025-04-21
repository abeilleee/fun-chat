import { ClientApi } from '../server-api/client-api';
import { checkDeletingMessage, getMessages } from '../state/reducers/dialog/dialog-reducer';
import { getUsers, handlerLoginLogout } from '../state/reducers/users/user-states-reducer';
import { EVENT_TYPE, SERVER_URL } from './constants';
import { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import { connectionClosed, connectionOpen } from '../custom-events/custom-events';
import { closeHandler, openHandler } from './handlers';
import type { Message } from '../server-api/types/chat';
import { checkErrors } from '../state/reducers/auth/auth-reducer';

export class WebSocketConnection {
    public isOpen: boolean = false;
    private websocket: WebSocket | null = null;
    private clientApi: ClientApi;
    private connectionWaiter: ConnectionWaiter;

    constructor() {
        this.clientApi = new ClientApi(this);
        this.openConnection();
        this.connectionWaiter = new ConnectionWaiter();

        closeHandler(this.connectionWaiter);
    }

    public send(message: Message): void {
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
            this.connectionWaiter.hideWaiter();

            openHandler(this.clientApi);
            dispatchEvent(connectionOpen); //TODO: delete
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, (event) => {
            // console.log('WebSocket error: ', event);
        });
        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, (message: MessageEvent) => {
                const response = message.data;
                getUsers(response);
                handlerLoginLogout(response);
                getMessages(response);
                checkErrors(response);
                checkDeletingMessage(response);
            });
            this.websocket.addEventListener(EVENT_TYPE.CLOSE, (event) => {
                this.isOpen = false;
                dispatchEvent(connectionClosed);

                setTimeout(() => {
                    this.openConnection();
                }, 1000);
            });
        }
    }
}
