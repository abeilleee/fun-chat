import { generateId } from '../../utils/id-generator';
import { MESSAGE_ACTIONS, type USER_STATUS } from './constants';
import type { Message } from './types/chat';
import type { Payload } from './types/user';
import type { WebSocketConnection } from '../web-socket-connection/web-socket-connection';

export class ClientApi {
    private webSocket: WebSocketConnection;

    constructor(websocket: WebSocketConnection) {
        this.webSocket = websocket;
    }

    public sendRequestToServer(type: USER_STATUS | MESSAGE_ACTIONS, payload: Payload): void {
        const id = generateId();
        const message = {
            id: id,
            type: type,
            payload: payload,
        };

        this.webSocket.send(message);
    }

    public sendMessage(recipient: string, text: string): void {
        const id = generateId();
        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_SEND,
            payload: {
                message: {
                    to: recipient,
                    text: text,
                },
            },
        };

        this.webSocket.send(message);
    }

    public readMessage(messageId: string): void {
        const id = generateId();

        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_READ,
            payload: {
                message: {
                    id: messageId,
                },
            },
        };

        this.webSocket.send(message);
    }

    public requestChatHistory(selectedUser: string, id: string): void {
        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_FROM_USER,
            payload: {
                user: {
                    login: selectedUser,
                },
            },
        };

        this.webSocket.send(message);
    }

    public deleteMsg(idMsg: string): void {
        const id = generateId();

        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_DELETE,
            payload: {
                message: {
                    id: idMsg,
                },
            },
        };

        this.webSocket.send(message);
    }

    public editMessage(idMsg: string, text: string): void {
        const id = generateId();

        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_EDIT,
            payload: {
                message: {
                    id: idMsg,
                    text: text,
                },
            },
        };

        this.webSocket.send(message);
    }

    public msgReadStatusChange(messageItem: Message): void {
        const id = generateId();
        const msgId = messageItem.id;

        const message = {
            id: id,
            type: MESSAGE_ACTIONS.MSG_READ,
            payload: {
                message: {
                    id: msgId,
                },
            },
        };

        this.webSocket.send(message);
    }
}
