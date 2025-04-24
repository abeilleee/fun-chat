import { allUsersChange, changeChatHistory, onLogin } from '../../../custom-events/custom-events';
import { USER_STATUS } from '../../../server-api/constants';
import type { Dialog, Message } from '../../../server-api/types/chat';
import type { User } from '../../../server-api/types/user';
import { getCurrentUsername } from '../../../storage/storage';
import { changeDialogState, dialogState, unreadMessages } from '../dialog/dialog-reducer';
import type { AllUsers, SelectedUser } from './types';

export const allUsers: AllUsers = {
    inactive: [],
    active: [],
};
export const selectedUser: SelectedUser = {
    username: '',
    status: '',
};

export let isChatChange = false;

export function isChatChangeToggler(value: boolean): void {
    isChatChange = value;
}

export function getUsers(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case USER_STATUS.INACTIVE: {
            const currentUser = getCurrentUsername();
            const inactiveUsers = payload.users;
            if (Array.isArray(inactiveUsers)) {
                allUsers.inactive = inactiveUsers.filter((elem) => elem.login !== currentUser);
            }
            dispatchEvent(allUsersChange);
            break;
        }
        case USER_STATUS.ACTIVE: {
            const currentUser = getCurrentUsername();
            const activeUsers = payload.users;
            if (Array.isArray(activeUsers)) {
                allUsers.active = activeUsers.filter((elem) => elem.login !== currentUser);
            }
            dispatchEvent(allUsersChange);
            break;
        }
        case USER_STATUS.EXTERNAL_LOGOUT: {
            const logoutUser = payload.user;
            const logoutUserLogin = payload.user.login;
            const active = allUsers.active.filter((elem: User) => elem.login !== logoutUserLogin);
            allUsers.active = active;
            allUsers.inactive = [...allUsers.inactive, logoutUser];
            dispatchEvent(allUsersChange);
            dispatchEvent(changeChatHistory);
            break;
        }
        case USER_STATUS.EXTERNAL_LOGIN: {
            const user = payload.user;
            const loginUser = payload.user.login;
            const inactive = allUsers.inactive.filter((elem: User) => elem.login !== loginUser);
            allUsers.inactive = inactive;
            allUsers.active = [...allUsers.active, user];

            // const state = dialogState;
            // const targetDialog = state.find((dialog: Dialog) => dialog.login === loginUser);

            // targetDialog?.messages.forEach((message: Message) => {
            //     if (message.status && message.status.isDelivered === false) {
            //         message.status.isDelivered = true;
            //         console.log('message.status.isDelivered: ', message.status.isDelivered);
            //     }
            // });
            // console.log('TARGET DIALOG: ', targetDialog);

            // changeDialogState(state);
            dispatchEvent(allUsersChange);
            dispatchEvent(changeChatHistory);
            break;
        }
    }
    // dispatchEvent(allUsersChange);
}

export function handlerLoginLogout(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case USER_STATUS.LOGIN: {
            dispatchEvent(onLogin);
            unreadMessages();
            break;
        }
        case USER_STATUS.LOGOUT: {
            unreadMessages();
            break;
        }
    }
}
export function getAllUsers(): AllUsers {
    return allUsers;
}
