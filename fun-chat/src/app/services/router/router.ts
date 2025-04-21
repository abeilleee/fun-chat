import { isLogined } from '../storage/storage';
import { HistoryRoutesHandler } from './history-routes-handler';
import { PAGES, type UserRequest, type Route } from './types';

export class Router {
    private routes: Route[];
    private handler: HistoryRoutesHandler;

    constructor(routes: Route[]) {
        this.routes = routes;
        this.handler = new HistoryRoutesHandler(this.urlHandler.bind(this));

        document.addEventListener('DOMContentLoaded', () => {
            this.handler.navigate(history.state);
            this.redirectToMainPage();
            this.redirectToAuthPage();
        });

        window.addEventListener('popstate', () => {
            this.redirectToMainPage();
            this.redirectToAuthPage();
        });

        window.addEventListener('hashchange', () => {
            this.redirectToMainPage();
            this.redirectToAuthPage();
        });
    }

    public navigate(url: string): void {
        this.handler.navigate(url);
    }

    public redirectToMainPage(): void {
        const isAuth = isLogined();

        const path = window.location.pathname;
        if (isAuth && path === `/auth`) {
            this.navigate(PAGES.MAIN);
        }
    }

    public redirectToAuthPage(): void {
        const isAuth = isLogined();
        const path = window.location.pathname;
        if (!isAuth && path === `/main`) {
            this.navigate(PAGES.AUTH);
        }
    }

    private redirectToNotFoundPage(): void {
        const notFoundPage = this.routes.find((elem) => elem.path === String(PAGES.NOT_FOUND));
        if (notFoundPage) {
            this.navigate(notFoundPage.path);
        }
    }

    private urlHandler(request: UserRequest): void {
        const targetPath = request.path;
        const route = this.routes.find((elem) => elem.path === targetPath);
        if (!route) {
            this.redirectToNotFoundPage();
            return;
        }
        route.callback(request.resource);
    }
}
