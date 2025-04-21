import { selectUser } from '../../../../services/custom-events/custom-events';
import type { ClientApi } from '../../../../services/server-api/client-api';
import { allUsers, selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';

export function handleUserSelect(targetElement: HTMLElement, clientApi: ClientApi): void {
    // clientApi.requestChatHistory(selectedUser.username);
    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');
    const username = userBox?.querySelector('.user-element')?.textContent;
    if (username) {
        selectedUser.username = username;
        const status = allUsers.inactive.some((elem) => elem.login === username) ? 'offline' : 'online';
        selectedUser.status = status;
        dispatchEvent(selectUser)
    }
}
