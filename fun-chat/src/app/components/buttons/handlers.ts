import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';
import type { ClientApi } from '../../services/server-api/api';
import { USER_MESSAGE_TYPE } from '../../services/server-api/constants';
import type { Payload, User } from '../../services/server-api/types/user-actions';
import type { SessionStorage } from '../../services/storage/storage';

export function handlerBtnAbout(router: Router): void {
    router.navigate(PAGES.ABOUT);
}

export function handlerBtnLogout(router: Router): void {
    router.navigate(PAGES.AUTH);
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
    clientApi: ClientApi,
    storage: SessionStorage
): void {
    if (isValidLogin && isValidPassword) {
        router.navigate(PAGES.MAIN);

        const payload: Payload = {
            user: {
                login: login,
                password: password,
            },
        };

        const userData: User = {
            login: login,
            password: password,
            isLogined: true,
        };

        clientApi.sendRequestToServer(USER_MESSAGE_TYPE.LOGIN, payload);
        storage.setData(userData);
    }
}
