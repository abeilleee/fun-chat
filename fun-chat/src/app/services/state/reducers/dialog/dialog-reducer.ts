import {
    changeChatHistory,
    deleteMsg,
    editMsg,
    getNewMessages,
    msgSend,
    selectedUserChanged,
} from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';
import { getCurrentUsername } from '../../../storage/storage';
import type { UserUnreadMessages } from '../../types';
import { PendingRequest } from '../users/types';
import { selectedUser } from '../users/user-states-reducer';

export let isOpenChat = false;
export let isDialog = false;

export function isOpenChatToggler(value: boolean): void {
    isOpenChat = value;
}

export function isDialogToggler(value: boolean): void {
    isDialog = value;
}

export let pendingRequests: PendingRequest[] = [];

export let dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const state = dialogState;
            // const idResp = id;
            const isMymessage = id !== null;
            const message: Message = payload.message;
            let targetDialog: Dialog | undefined;

            // if (idResp === null) {
            //     dispatchEvent(getNewMessages);
            // }
            const recipient = payload.message.to;
            const sender = payload.message.from;
            targetDialog = isMymessage
                ? state.find((dialog) => dialog.login === recipient)
                : state.find((dialog) => dialog.login === sender);
            if (!targetDialog) {
                const newDialog = { login: isMymessage ? recipient : sender, messages: [] };
                state.push(newDialog);
                targetDialog = newDialog;
            }
            //bcz of eslint error '@typescript-eslint/no-unsafe-call'
            if (targetDialog && Array.isArray(targetDialog.messages)) {
                targetDialog.messages.push(message);
            }

            dialogState = state;
            dispatchEvent(msgSend);
            dispatchEvent(changeChatHistory);
            dispatchEvent(getNewMessages);

            break;
        }
        case MESSAGE_ACTIONS.MSG_FROM_USER: {
            const state = dialogState;
            const requestId = id;
            const messages: Message[] = payload.messages;

            const targetUserRequest = pendingRequests.find(
                (request: PendingRequest) => request.requestId === requestId
            );

            const recipient: string = selectedUser.username;
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

            const unreadMessagesNumber = messages.filter(
                (message) => !message.status?.isReaded && message.from === targetUserRequest?.username
            ).length;
            if (targetUserRequest) targetUserRequest.unreadMessagesNumber = unreadMessagesNumber;

            dialogState = state;
            changeDialogState(state);
            dispatchEvent(changeChatHistory);
            dispatchEvent(selectedUserChanged);
            break;
        }
    }
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
    const { id, type, payload } = JSON.parse(data);
    if (type === MESSAGE_ACTIONS.MSG_DELETE) {
        const newDialogState = dialogState.map((dialog) => ({
            ...dialog,
            messages: dialog.messages.filter((message) => message.id !== payload.message.id),
        }));
        dialogState = newDialogState;
        dispatchEvent(deleteMsg);
    }
}

export function editMessage(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    if (type === MESSAGE_ACTIONS.MSG_EDIT) {
        const msgId: string = payload.message.id;
        const text: string = payload.message.text;
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
