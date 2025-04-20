import { changeChatHistory, getNewMessages, msgSend, selectedUserChanged } from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';
import type { UserUnreadMessages } from '../../types';
import { selectedUser } from '../users/user-states-reducer';

export const dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const idResp = id;
            const message: Message = payload.message;
            let targetDialog: Dialog | undefined;

            if (!idResp) {
                console.log('get new message (unread) (inside dialog reducer)');
                checkUnreadMessages();
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

export function checkUnreadMessages(): UserUnreadMessages[] {
    const unreadMessagesNumber: UserUnreadMessages[] = [];
    const state = dialogState;

    state.forEach((userdialog) => {
        const username = userdialog.login;
        let unreadMessagesCount = 0;

        userdialog.messages.forEach((message: Message) => {
            if (message.status?.isReaded === false) {
                unreadMessagesCount++;
            }
        });

        const result: UserUnreadMessages = {
            username: username,
            unreadMessages: unreadMessagesCount,
        };

        unreadMessagesNumber.push(result);
    });
    console.log(unreadMessagesNumber);
    dispatchEvent(getNewMessages);
    return unreadMessagesNumber;
}
