import { allUsersChange } from '../../../custom-events/custom-events';
import { USER_STATUS } from '../../../server-api/constants';
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

    console.log(allUsers);

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

        // case USER_STATUS.LOGIN: {
        //     const currentUser = user;
        //     const id = currentUser.id;
        // }

        // case USER_STATUS.LOGOUT: {
        //     const currentLogoutUser = user;
        //     const id = currentLogoutUser.id;
        // }
    }
}

export function getAllUsers(): AllUsers {
    return allUsers;
}
