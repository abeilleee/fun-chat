import { EVENT_TYPE, SERVER_URL } from './constants';

export class WebSocketConnection {
    private websocket: WebSocket | null;
    private isOpen: boolean = false;

    constructor() {
        this.websocket = null;
        this.openConnection();
    }

    private openConnection(): void {
        this.websocket = new WebSocket(SERVER_URL);

        this.websocket.addEventListener(EVENT_TYPE.OPEN, () => {
            this.isOpen = true;
            console.log('connection is open');
        });

        this.websocket.addEventListener(EVENT_TYPE.ERROR, () => {
            console.log('error while connecting');
        });

        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (this.websocket) {
            this.websocket.addEventListener(EVENT_TYPE.MESSAGE, () => {
                console.log('message event');
            });
            this.websocket.addEventListener(EVENT_TYPE.CLOSE, () => {
                console.log('connection was closed');
                this.isOpen = false;
            });
        }
    }
}
