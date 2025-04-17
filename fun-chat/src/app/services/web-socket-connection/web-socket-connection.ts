import type { ServerMessage } from '../server-api/types/server-actions';
import { EVENT_TYPE, SERVER_URL } from './constants';

export class WebSocketConnection {
    private websocket: WebSocket | null;
    private isOpen: boolean = false;

    constructor() {
        this.websocket = null;
        this.openConnection();
    }

    public send(message: ServerMessage): void {
        if (this.websocket !== null) {
            this.websocket?.send(JSON.stringify(message));
        }
    }

    private openConnection(): void {
        this.websocket = new WebSocket(SERVER_URL);

        this.websocket.addEventListener(EVENT_TYPE.OPEN, () => {
            this.isOpen = true;
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, () => {});

        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, () => {});
            this.websocket.addEventListener(EVENT_TYPE.CLOSE, () => {
                this.isOpen = false;
            });
        }
    }
}
