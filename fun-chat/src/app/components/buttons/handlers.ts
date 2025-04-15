import type { Router } from '../../services/router/router';
import { PAGES } from '../../services/router/types';

export function handlerBtnAbout(router: Router): void {
    router.navigate(PAGES.ABOUT);
}

export function handlerBtnLogout(router: Router): void {
    router.navigate(PAGES.AUTH);
}

export function handlerBtnBack(router: Router): void {
    history.back();
}
