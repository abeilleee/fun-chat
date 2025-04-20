import { msgSend } from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';

export const dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);

    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const message: Message = payload.message;
            const recipient = message.to;

            const targetDialog = dialogState.find((dialog) => dialog.login === recipient);
            //bcz of eslint error '@typescript-eslint/no-unsafe-call'
            if (targetDialog && Array.isArray(targetDialog.messages)) {
                targetDialog.messages.push(message);
            }

            dispatchEvent(msgSend);
            break;
        }
    }
}
