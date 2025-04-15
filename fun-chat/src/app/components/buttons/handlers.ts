import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';

export function handlerBtnAbout(router: Router): void {
    router.navigate(PAGES.ABOUT);
    console.log('about');
}

export function handlerBtnLogout(router: Router): void {
    router.navigate(PAGES.AUTH);
}

export function handlerBtnBack(router: Router): void {
    history.back();
}

export function handlerBtnLogin(router: Router): void {
    router.navigate(PAGES.MAIN);
}
