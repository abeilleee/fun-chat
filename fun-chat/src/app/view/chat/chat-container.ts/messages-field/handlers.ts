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
