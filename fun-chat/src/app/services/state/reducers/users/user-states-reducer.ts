import { allUsersChange } from '../../../custom-events/custom-events';
import { USER_STATUS } from '../../../server-api/constants';
import type { User } from '../../../server-api/types/user';
import { getCurrentUsername } from '../../../storage/storage';
import type { AllUsers } from './types';

export const allUsers: AllUsers = {
    inactive: [],
    active: [],
    selectedUser: {
        username: '',
        status: '',
    },
};

export function getUsers(data: string): void {
    const { id, type, payload } = JSON.parse(data);
    switch (type) {
        case USER_STATUS.INACTIVE: {
            const currentUser = getCurrentUsername();
            const inactiveUsers = payload.users;
            if (Array.isArray(inactiveUsers)) {
                allUsers.inactive = inactiveUsers.filter((elem) => elem.login !== currentUser);
            }
            break;
        }
        case USER_STATUS.ACTIVE: {
            const currentUser = getCurrentUsername();
            const activeUsers = payload.users;
            if (Array.isArray(activeUsers)) {
                allUsers.active = activeUsers.filter((elem) => elem.login !== currentUser);
            }
            break;
        }
        case USER_STATUS.EXTERNAL_LOGOUT: {
            const logoutUser = payload.user;
            const logoutUserLogin = payload.user.login;
            const active = allUsers.active.filter((elem: User) => elem.login !== logoutUserLogin);
            allUsers.active = active;
            allUsers.inactive = [...allUsers.inactive, logoutUser];
            break;
        }
        case USER_STATUS.EXTERNAL_LOGIN: {
            const loginUser = payload.user;
            const loginUserLogin = payload.user.login;
            const inactive = allUsers.inactive.filter((elem: User) => elem.login !== loginUserLogin);
            allUsers.inactive = inactive;
            allUsers.active = [...allUsers.active, loginUser];
            break;
        }
    }
    dispatchEvent(allUsersChange);
}

export function getAllUsers(): AllUsers {
    return allUsers;
}
