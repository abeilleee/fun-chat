import { msgSend } from '../../../custom-events/custom-events';
import { MESSAGE_ACTIONS } from '../../../server-api/constants';
import type { Dialog } from '../../../server-api/types/chat-actions';

export const dialogState = new Array<Dialog>();

export function getMessages(data: string): void {
    const { id, type, payload } = JSON.parse(data);

    switch (type) {
        case MESSAGE_ACTIONS.MSG_SEND: {
            const newDialog: Dialog = {
                id: payload.id,
                messages: payload.message,
            };
            dialogState.push(newDialog);
            dispatchEvent(msgSend);
            break;
        }
    }
}
