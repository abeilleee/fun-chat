import { SessionStorage } from '../storage/storage';
import { HistoryRoutesHandler } from './history-routes-handler';
import { PAGES, type UserRequest, type Route } from './types';

export class Router {
    private routes: Route[];
    private handler: HistoryRoutesHandler;
    private storage: SessionStorage;

    constructor(routes: Route[]) {
        this.routes = routes;
        this.handler = new HistoryRoutesHandler(this.urlHandler.bind(this));
        this.storage = new SessionStorage();

        document.addEventListener('DOMContentLoaded', () => {
            this.handler.navigate(history.state);
            this.redirectToMainPage();
            this.redirectToAuthPage();
        });
    }

    public navigate(url: string): void {
        this.handler.navigate(url);
    }

    public redirectToMainPage(): void {
        const data = this.storage.getData();
        const path = window.location.pathname;

        if (path === `/${PAGES.AUTH}` && true) {
            this.navigate(PAGES.MAIN);
            console.log('redirect');
        }
    }

    public redirectToAuthPage(): void {
        const data = this.storage.getData();
        const path = window.location.pathname;

        if (path === `/${PAGES.MAIN}` && !data) {
            this.navigate(PAGES.AUTH);
            console.log('redirect');
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
