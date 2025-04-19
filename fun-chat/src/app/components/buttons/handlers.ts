import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';
import type { ClientApi } from '../../services/server-api/api';
import { MESSAGE_ACTIONS, USER_STATUS } from '../../services/server-api/constants';
import type { Payload, User } from '../../services/server-api/types/user-actions';
import { allUsers } from '../../services/state/reducers/users/user-states-reducer';
import { getStorageData, setData, toggleIsLogined } from '../../services/storage/storage';
import { generateId } from '../../utils/id-generator';

export function handlerBtnLogout(router: Router, clientApi: ClientApi): void {
    const id = generateId();
    const data = getStorageData();
    if (data && 'login' in data && 'password' in data) {
        const login = data.login;
        const password = data.password;
        if (typeof login === 'string' && typeof password === 'string') {
            const payload: Payload = {
                user: {
                    login: login,
                    password: password,
                },
            };
            clientApi.sendRequestToServer(USER_STATUS.LOGOUT, payload, id);
            router.navigate(PAGES.AUTH);
            toggleIsLogined();
        }
    }
}

export function handlerBtnAbout(router: Router): void {
    router.navigate(PAGES.ABOUT);
}

export function handlerBtnBack(router: Router): void {
    history.back();
}

export function handlerBtnLogin(
    router: Router,
    isValidLogin: boolean,
    isValidPassword: boolean,
    login: string,
    password: string,
    clientApi: ClientApi
): void {
    if (isValidLogin && isValidPassword) {
        router.navigate(PAGES.MAIN);
        const id = generateId();

        const payload: Payload = {
            user: {
                login: login,
                password: password,
            },
        };

        clientApi.sendRequestToServer(USER_STATUS.LOGIN, payload, id);
        clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null, id);
        clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null, id);

        const userData: User = {
            login: login,
            password: password,
            isLogined: true,
        };

        setData(userData);
    }
}

export function handlerBtnSend(text: string, clientApi: ClientApi): void {
    const id = generateId();
    const recipientName = allUsers.selectedUser.username;
    const payload = {
        message: {
            to: recipientName,
            text: text,
        },
    };
    clientApi.sendRequestToServer(MESSAGE_ACTIONS.MSG_SEND, payload, id);
}
