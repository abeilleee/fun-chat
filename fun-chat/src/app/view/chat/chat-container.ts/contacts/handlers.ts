import { selectedUserChanged } from '../../../../services/custom-events/custom-events';
import { allUsers } from '../../../../services/state/reducers/users/user-states';

export function handleUserSelect(targetElement: HTMLElement, list: HTMLElement): void {
    const elements = list.children;
    Array.from(elements).forEach((child) => {
        child.classList.remove('user-selected');
    });

    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');
    const username = userBox?.textContent;

    const userBoxElements = userBox?.children;
    Array.from(elements).forEach((child) => {
        if (child.classList.contains('user-indicator--online')) {
            console.log('ONLINE');
        }
    });

    if (username) {
        allUsers.selectedUser.username = username;
        const status = allUsers.inactive.some((elem) => elem.login === username) ? 'offline' : 'online';
        allUsers.selectedUser.status = status;
        dispatchEvent(selectedUserChanged);
        console.log('allUsers: ', allUsers);
    }
    if (userBox) {
        userBox.classList.toggle('user-selected');
    }
}
