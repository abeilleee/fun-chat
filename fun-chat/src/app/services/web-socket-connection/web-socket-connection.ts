import { ClientApi } from '../server-api/api';
import type { ServerMessage } from '../server-api/types/server-actions';
import { getUsers } from '../state/reducers/users/user-states';
import { EVENT_TYPE, SERVER_URL } from './constants';
import { openHandler } from './handlers';

export class WebSocketConnection {
    public isOpen: boolean = false;
    private websocket: WebSocket | null;
    private clientApi: ClientApi | null;

    constructor() {
        this.websocket = null;
        this.clientApi = null;
        this.openConnection();
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
        this.clientApi = new ClientApi(this);

        this.websocket.addEventListener(EVENT_TYPE.OPEN, () => {
            this.isOpen = true;
            if (this.clientApi) openHandler(this.clientApi);
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, () => {});

        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, (message: MessageEvent) => {
                const response = message.data;
                console.log('response: ', response);
                getUsers(response);
            });
            this.websocket.addEventListener(EVENT_TYPE.CLOSE, () => {
                this.isOpen = false;
            });
        }
    }
}
