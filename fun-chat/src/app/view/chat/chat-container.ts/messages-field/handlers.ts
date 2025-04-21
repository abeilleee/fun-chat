import type { ContextMenu } from '../../../../components/context-menu.ts/context-menu';
import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Message } from '../../../../services/server-api/types/chat';
import { dialogState } from '../../../../services/state/reducers/dialog/dialog-reducer';
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

export function messageHandler(contextMenu: ContextMenu): void {
    const elements = document.querySelectorAll('.message-box');
    console.log('query selector on message box');
    Array.from(elements).forEach((elem) => {
        if (elem instanceof HTMLElement) {
            elem.addEventListener('contextmenu', (event: MouseEvent) => {
                event.preventDefault();
                const { clientX, clientY } = event;
                console.log(clientX);
                if (!contextMenu.isOpen) {
                    contextMenu.showMenu(clientX, clientY);
                    contextMenu.setEventListeners();
                }
                return;
            });
        }
    });
    document.addEventListener('click', () => {
        contextMenu.closeMenu();
    });
}
