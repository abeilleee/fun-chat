import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Message } from '../../../../services/server-api/types/chat';
import { dialogState } from '../../../../services/state/reducers/dialog/dialog-reducer';
import { allUsers, selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';

export function handleUserSelect(targetElement: HTMLElement, list: HTMLElement, clientApi: ClientApi): void {
    clientApi.requestChatHistory(selectedUser.username);

    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');
    const username = userBox?.textContent;

    if (username) {
        selectedUser.username = username;
        const status = allUsers.inactive.some((elem) => elem.login === username) ? 'offline' : 'online';
        selectedUser.status = status;
    }
}

export function changeMessagesStatus(selectedUser: string, clientApi: ClientApi): void {
    const targetDialog = dialogState.find((dialog) => dialog.login === selectedUser);
    targetDialog?.messages.forEach((message: Message) => {
        if (message.status?.isReaded === false) {
            const msgId = message.id;
            if (msgId) clientApi.readMessage(msgId);
        }
    });
}
