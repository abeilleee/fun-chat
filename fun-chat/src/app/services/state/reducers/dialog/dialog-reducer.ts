import {
    changeChatHistory,
    deleteMsg,
    editMsg,
    getNewMessages,
    msgSend,
    selectedUserChanged,
} from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../client-api/constants';
import { getCurrentUsername } from '../../../storage/storage';
import { selectedUser } from '../users/user-states-reducer';
import type { UserUnreadMessages } from '../../types';
import type { PendingRequest } from '../users/types';
import type { Dialog, Message } from '../../../client-api/types/chat';
import type { ServerMessage } from '../../../client-api/types/server';

export let pendingRequests: PendingRequest[] = [];
export let dialogState = new Array<Dialog>();

export let isOpenChat = false;
export let isDialog = false;

export function isOpenChatToggler(value: boolean): void {
    isOpenChat = value;
}

export function isDialogToggler(value: boolean): void {
    isDialog = value;
}

export function getMessages(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (payload.message && type === MESSAGE_ACTIONS.MSG_SEND) {
        const state: Dialog[] = dialogState;
        const isMymessage = id !== null;
        const message: Message = payload.message;
        let targetDialog: Dialog | undefined;
        const recipient = payload.message.to;
        const sender = payload.message.from;

        targetDialog = isMymessage
            ? state.find((dialog) => dialog.login === recipient)
            : state.find((dialog) => dialog.login === sender);

        if (!targetDialog && recipient && sender) {
            const newDialog: Dialog = { login: isMymessage ? recipient : sender, messages: [] };
            state.push(newDialog);
            targetDialog = newDialog;
        }

        if (targetDialog && Array.isArray(targetDialog.messages)) {
            targetDialog.messages.push(message);
        }

        dialogState = state;
        dispatchEvent(msgSend);
        dispatchEvent(changeChatHistory);
        dispatchEvent(getNewMessages);
    }
}

export function getChatHistory(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (type === MESSAGE_ACTIONS.MSG_FROM_USER) {
        const state = dialogState;
        const requestId: string = id;

        if (payload.messages) {
            const messages: Message[] = payload.messages;
            const pendingState: PendingRequest[] = pendingRequests;
            const targetUserRequest = pendingState.find((request: PendingRequest) => request.requestId === requestId);

            if (targetUserRequest?.username) {
                const recipient: string = targetUserRequest?.username;
                let targetDialog = state.find((dialog) => dialog.login === recipient);

                if (!targetDialog) {
                    targetDialog = {
                        login: recipient,
                        messages: messages,
                    };
                    state.push(targetDialog);
                } else {
                    targetDialog.messages = messages;
                }
            }
            const unreadMessagesNumber = messages.filter(
                (message) => !message.status?.isReaded && message.from === targetUserRequest?.username
            ).length;
            if (targetUserRequest) targetUserRequest.unreadMessagesNumber = unreadMessagesNumber;
            dialogState = state;
            pendingRequests = pendingState;
        }

        changeDialogState(state);
        dispatchEvent(changeChatHistory);
        dispatchEvent(selectedUserChanged);
    }
}

export function changeReadStatus(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (type === MESSAGE_ACTIONS.MSG_READ && payload.message && payload.message.status) {
        const status: boolean = payload.message.status.isReaded;
        const msgId: string | undefined = payload.message.id;
        const state = dialogState;
        const targetDialog = state.find((dialog) => dialog.login === selectedUser.username);

        targetDialog?.messages.forEach((message) => {
            if (message.id === msgId && message.status) {
                message.status.isReaded = status;
            }
        });
    }
    dispatchEvent(changeChatHistory);
}

export function deliverNotification(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (type === MESSAGE_ACTIONS.MSG_DELIVER) {
        const message = payload.message;

        if (message) {
            const msgId = message.id;
            const state = dialogState;

            if (message.status) {
                const status = message.status?.isDelivered;
                const targetDialog = state.forEach((dialog) => {
                    dialog.messages.forEach((message) => {
                        if (message.id === msgId && message.status) {
                            message.status.isDelivered = status;
                        }
                    });
                });
            }

            dialogState = state;
        }
    }
    dispatchEvent(changeChatHistory);
}

export let unreadMessagesNumber: UserUnreadMessages[] = [];

export function unreadMessages(): void {
    const state = dialogState;
    const unreadMessagesMap: Map<string, number> = new Map();

    state.forEach((dialog) => {
        const user = dialog.login;
        const unreadCount = dialog.messages.filter(
            (message: Message) => !message.status?.isReaded && message.to === getCurrentUsername()
        ).length;

        if (unreadMessagesMap.has(user)) {
            const targetUser = unreadMessagesMap.get(user);
            if (targetUser) unreadMessagesMap.set(user, targetUser + unreadCount);
        } else {
            unreadMessagesMap.set(user, unreadCount);
        }
    });
    unreadMessagesNumber = Array.from(unreadMessagesMap.entries()).map(([username, unreadMessages]) => ({
        username,
        unreadMessages,
    }));
}

export function checkDeletingMessage(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (payload.message && type === MESSAGE_ACTIONS.MSG_DELETE) {
        const newDialogState = dialogState.map((dialog) => ({
            ...dialog,
            messages: dialog.messages.filter((message) => {
                if (payload.message) message.id !== payload.message.id;
            }),
        }));
        dialogState = newDialogState;
        dispatchEvent(deleteMsg);
    }
}

export function editMessage(data: string): void {
    const parsedData: ServerMessage = JSON.parse(data);
    const { id, type, payload } = parsedData;

    if (type === MESSAGE_ACTIONS.MSG_EDIT && payload.message) {
        const msgId = payload.message.id;
        const text = payload.message.text;
        const state: Dialog[] = dialogState.map((dialog) => {
            return {
                ...dialog,
                messages: dialog.messages.map((message: Message) => {
                    if (message.id === msgId && message.status) {
                        message.text = text;
                        message.status.isEdited = true;
                        return { ...message };
                    } else {
                        return message;
                    }
                }),
            };
        });
        dialogState = state;
        dispatchEvent(editMsg);
    }
}

export function changeDialogState(state: Dialog[]): void {
    dialogState = state;
}
