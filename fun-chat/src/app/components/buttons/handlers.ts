import { PAGES } from '../../services/router/types';
import { USER_STATUS } from '../../services/client-api/constants';
import { isDialogToggler, isOpenChatToggler } from '../../services/state/reducers/dialog/dialog-reducer';
import { isChatChangeToggler, selectedUser } from '../../services/state/reducers/users/user-states-reducer';
import { getStorageData, isLogined, toggleIsLogined } from '../../services/storage/storage';
import { scrollToBottom } from '../../utils/message-filled-utils';
import { handlerReadingMessages } from '../../view/chat/chat-container.ts/messages-field/handlers';
import type { Payload } from '../../services/client-api/types/user';
import type { ClientApi } from '../../services/client-api/client-api';
import type { Router } from '../../services/router/router';

export function handlerBtnLogout(router: Router, clientApi: ClientApi): void {
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
}

export function handlerBtnLogin(
    isValidLogin: boolean,
    isValidPassword: boolean,
    login: string,
    password: string,
    clientApi: ClientApi
): void {
    if (isValidLogin && isValidPassword) {
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
    handlerReadingMessages(clientApi);
    const dialog = document.querySelector('.dialog-wrapper--active');
    if (dialog instanceof HTMLElement) scrollToBottom(dialog);
    isChatChangeToggler(false);
}
