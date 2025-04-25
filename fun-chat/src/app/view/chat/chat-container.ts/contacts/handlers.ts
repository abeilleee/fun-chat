import { selectUser } from '../../../../services/custom-events/custom-events';
import {
    allUsers,
    isChatChangeToggler,
    selectedUser,
} from '../../../../services/state/reducers/users/user-states-reducer';

export function handleUserSelect(targetElement: HTMLElement): void {
    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');
    const username = userBox?.querySelector('.user-element')?.textContent;
    if (username) {
        selectedUser.username = username;
        const status = allUsers.inactive.some((elem) => elem.login === username) ? 'offline' : 'online';
        selectedUser.status = status;
        dispatchEvent(selectUser);
    }
    isChatChangeToggler(true);
}
