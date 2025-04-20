import { msgSend, requestChatHistory } from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';
import { allUsers, selectedUser } from '../users/user-states-reducer';

export const dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);

    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const idResp = id;
            const message: Message = payload.message;
            const recipient = payload.message.to;
            console.log('responce get: ', data);
            console.log('recipient: ', recipient);
            if (idResp) {
                let targetDialog = dialogState.find((dialog) => dialog.login === recipient);
                if (!targetDialog) {
                    const newDialog = { login: recipient, messages: [] };
                    dialogState.push(newDialog);
                    targetDialog = newDialog;
                }
                //bcz of eslint error '@typescript-eslint/no-unsafe-call'
                if (targetDialog && Array.isArray(targetDialog.messages)) {
                    targetDialog.messages.push(message);
                }
                console.log('target dialog inside response from the serber: ', targetDialog);
                dispatchEvent(msgSend);
            }
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
            console.log('get dialog history from server');
            dispatchEvent(requestChatHistory);
            break;
        }
    }
}
