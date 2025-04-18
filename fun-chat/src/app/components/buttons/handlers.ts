import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';
import type { ClientApi } from '../../services/server-api/api';
import { USER_STATUS } from '../../services/server-api/constants';
import type { Payload, User } from '../../services/server-api/types/user-actions';
import { getStorageData, setData } from '../../services/storage/storage';
import { generateId } from '../../utils/id-generator';

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
    clientApi: ClientApi
): void {
    if (isValidLogin && isValidPassword) {
        router.navigate(PAGES.MAIN);
        let id: string = '';

        const data = getStorageData();
        if (!data) {
            id = generateId();
        } else if (data && 'id' in data && typeof data.id === 'string') {
            id = data.id;
        }

        const payload: Payload = {
            user: {
                login: login,
                password: password,
            },
        };

        clientApi.sendRequestToServer(USER_STATUS.LOGIN, payload, id);

        const userData: User = {
            login: login,
            password: password,
            isLogined: true,
            id: id,
        };

        setData(userData);
    }
}
