import type { ContextMenu } from '../../../../components/context-menu.ts/context-menu';
import { changeChatHistory } from '../../../../services/custom-events/custom-events';
import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Dialog, Message } from '../../../../services/server-api/types/chat';
import { changeDialogState, dialogState } from '../../../../services/state/reducers/dialog/dialog-reducer';
import { selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';

export function dialogWrapperHandler(clientApi: ClientApi): void {
    changeMessagesStatus(clientApi);
}

export function changeMessagesStatus(clientApi: ClientApi): void {
    const currentUser = selectedUser.username;
    const targetDialog = dialogState.find((dialog) => dialog.login === currentUser);
    targetDialog?.messages.forEach((message: Message) => {
        if (message.status?.isReaded === false) {
            const msgId = message.id;
            if (msgId) clientApi.readMessage(msgId);
        }
    });
}

export function messageHandler(contextMenu: ContextMenu, message: Message, clientApi: ClientApi): void {
    document.addEventListener('click', () => {
        contextMenu.closeMenu();
    });
}

export function handlerReadingMessages(clientApi: ClientApi): void {
    const state = dialogState;
    const targetDialog = state.find((dialog: Dialog) => dialog.login === selectedUser.username);
    targetDialog?.messages.forEach((message: Message) => {
        if (message.status) message.status.isReaded = true;
        clientApi.msgReadStatusChange(message);
    });
    changeDialogState(state);
    dispatchEvent(changeChatHistory);
}
