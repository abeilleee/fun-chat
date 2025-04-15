import { HistoryRoutesHandler } from './historyRoutesHandler';
import { PAGES, UserRequest, type Route } from './types';

export class Router {
    routes: Route[];
    handler: HistoryRoutesHandler;

    constructor(routes: Route[]) {
        this.routes = routes;
        this.handler = new HistoryRoutesHandler(this.urlHandler.bind(this));

        document.addEventListener('DOMContentLoaded', () => {
            this.handler.navigate(history.state);
            this.redirectToMainPage();
        });
    }

    public navigate(url: string): void {
        this.handler.navigate(url);
    }

    private redirectToNotFoundPage(): void {
        const notFoundPage = this.routes.find((elem) => elem.path === PAGES.NOT_FOUND);
        if (notFoundPage) {
            this.navigate(notFoundPage.path);
        }
    }

    public redirectToMainPage(): void {
        // const saveState = new SaveState();
        // const filledOptions = saveState.getFilledOptions();
        const path = window.location.pathname;

        this.navigate(PAGES.MAIN);
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
