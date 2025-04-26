import { ClientApi } from '../client-api/client-api';
import {
    changeReadStatus,
    checkDeletingMessage,
    deliverNotification,
    editMessage,
    getChatHistory,
    getMessages,
} from '../state/reducers/dialog/dialog-reducer';
import { checkExternalUsers, getUsers, handlerLoginLogout } from '../state/reducers/users/user-states-reducer';
import { DELAY, EVENT_TYPE, SERVER_URL } from './constants';
import { ConnectionWaiter } from '../../components/connection-waiter/connection-waiter';
import { connectionClosed } from '../custom-events/custom-events';
import { closeHandler, openHandler } from './handlers';
import type { Message } from '../client-api/types/chat';
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
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, (event) => {
            console.log('WebSocket error: ', event);
        });
        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, (message: MessageEvent) => {
                const response: string = message.data;
                handlerLoginLogout(response);
                getUsers(response);
                checkExternalUsers(response);
                getMessages(response);
                getChatHistory(response);
                checkErrors(response);
                checkDeletingMessage(response);
                editMessage(response);
                changeReadStatus(response);
                deliverNotification(response);
            });

            this.websocket.addEventListener(EVENT_TYPE.CLOSE, () => {
                this.isOpen = false;
                dispatchEvent(connectionClosed);

                setTimeout(() => {
                    this.openConnection();
                }, DELAY);
            });
        }
    }
}
