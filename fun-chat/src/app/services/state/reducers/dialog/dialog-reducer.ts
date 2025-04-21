import { changeChatHistory, getNewMessages, msgSend, selectedUserChanged } from '../../../custom-events/custom-events';
import type { ClientApi } from '../../../server-api/client-api';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';
import { getCurrentUsername } from '../../../storage/storage';
import type { UserUnreadMessages } from '../../types';
import { selectedUser } from '../users/user-states-reducer';

export let dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const idResp = id;
            const message: Message = payload.message;
            let targetDialog: Dialog | undefined;

            if (!idResp) {
                dispatchEvent(getNewMessages);
            }
            const recipient = payload.message.to;
            const sender = payload.message.from;
            targetDialog = idResp
                ? dialogState.find((dialog) => dialog.login === recipient)
                : dialogState.find((dialog) => dialog.login === sender);
            if (!targetDialog) {
                const newDialog = { login: recipient, messages: [] };
                dialogState.push(newDialog);
                targetDialog = newDialog;
            }
            //bcz of eslint error '@typescript-eslint/no-unsafe-call'
            if (targetDialog && Array.isArray(targetDialog.messages)) {
                targetDialog.messages.push(message);
            }
            dispatchEvent(msgSend);
            dispatchEvent(changeChatHistory);
            break;
        }
        case MESSAGE_ACTIONS.MSG_FROM_USER: {
            const messages: Message[] = payload.messages;
            const recipient: string = selectedUser.username;
            let targetDialog = dialogState.find((dialog) => dialog.login === recipient);
            if (!targetDialog) {
                targetDialog = {
                    login: recipient,
                    messages: messages,
                };
                dialogState.push(targetDialog);
            }
            targetDialog.login = recipient;
            targetDialog.messages = messages;
            dispatchEvent(changeChatHistory);
            dispatchEvent(selectedUserChanged);
            break;
        }
    }
}

export let isOpenChat = false;
export let isDialog = false;

export function isOpenChatToggler(value: boolean): void {
    isOpenChat = value;
}

export function isDialogToggler(value: boolean): void {
    isDialog = value;
}

export const unreadMessagesNumber: UserUnreadMessages[] = [];

addEventListener('getNewMessages', () => {
    console.log('unreadMessagesNumber: ', unreadMessagesNumber);
});

export function readMessages(clientApi: ClientApi): void {
    const currentUser = getCurrentUsername();
    const sender = selectedUser.username;

    const targetDialog = dialogState.find((dialog) => dialog.login === sender);
    const messages = targetDialog?.messages;

    messages?.forEach((message) => {
        if (message.status?.isReaded === false) {
            message.status.isReaded = true;
            const msgId = message.id;
            if (msgId) {
                clientApi.readMessage(msgId);
            }
        }
    });
}

export function checkDeletingMessage(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    if (type === MESSAGE_ACTIONS.MSG_DELETE) {
        const newDialogState = dialogState.map((dialog) => ({
            ...dialog,
            messages: dialog.messages.filter((message) => message.id !== payload.message.id),
        }));
        dialogState = newDialogState;

        console.log('dialog state: ', dialogState);
        dispatchEvent(changeChatHistory);
    }
}
