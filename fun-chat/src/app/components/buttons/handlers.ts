import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';
import type { ClientApi } from '../../services/server-api/client-api';
import { USER_STATUS } from '../../services/server-api/constants';
import type { Payload } from '../../services/server-api/types/user';
import { isDialogToggler, isOpenChatToggler } from '../../services/state/reducers/dialog/dialog-reducer';
import { selectedUser } from '../../services/state/reducers/users/user-states-reducer';
import { getStorageData, isLogined, toggleIsLogined } from '../../services/storage/storage';
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
            clientApi.sendRequestToServer(USER_STATUS.LOGOUT, payload);
            router.navigate(PAGES.AUTH);
            toggleIsLogined();
        }
    }
    selectedUser.status = '';
    selectedUser.username = '';
    isOpenChatToggler(false);
    isDialogToggler(false);
}

export function handlerBtnAbout(router: Router): void {
    router.navigate(PAGES.ABOUT);
}

export function handlerBtnBack(router: Router): void {
    const isAuth = isLogined();
    isAuth ? router.navigate(PAGES.MAIN) : router.navigate(PAGES.AUTH);
    // history.back();
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
        // const id = generateId();

        const payload: Payload = {
            user: {
                login: login,
                password: password,
            },
        };

        clientApi.sendRequestToServer(USER_STATUS.LOGIN, payload);

        clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null);
        clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null);
    }
}

export function handlerBtnSend(text: string, clientApi: ClientApi): void {
    const recipientName = selectedUser.username;
    clientApi.sendMessage(recipientName, text);
}
