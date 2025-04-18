import { allUsersChange, selectedUserChanged } from '../../../../services/custom-events/custom-events';
import { USER_STATUS } from '../../../../services/server-api/constants';
import { allUsers } from '../../../../services/state/reducers/users/user-states';

export function handleUserSelect(targetElement: HTMLElement, list: HTMLElement): void {
    const elements = list.children;
    Array.from(elements).forEach((child) => {
        child.classList.remove('user-selected');
    });
    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');
    const username = userBox?.textContent;
    let status = 'offline';
    const userBoxElements = userBox?.children;
    Array.from(elements).forEach((child) => {
        if (child.classList.contains('user-indicator--online')) {
            status = 'online';
            return;
        }
    });

    if (username) {
        console.log('change');
        allUsers.selectedUser.username = username;
        allUsers.selectedUser.status = status;
        dispatchEvent(selectedUserChanged);
    }
    if (userBox) {
        userBox.classList.toggle('user-selected');
    }
}
