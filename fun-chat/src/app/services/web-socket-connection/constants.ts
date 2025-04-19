export const SERVER_URL = 'ws://localhost:4000';

export enum EVENT_TYPE {
    OPEN = 'open',
    MESSAGE = 'message',
    ERROR = 'error',
    CLOSE = 'close',
}

export enum READYSTATE {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}
