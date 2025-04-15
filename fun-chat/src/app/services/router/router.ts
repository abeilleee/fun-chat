import { HistoryRoutesHandler } from './history-routes-handler';
import { PAGES, type UserRequest, type Route } from './types';

export class Router {
    private routes: Route[];
    private handler: HistoryRoutesHandler;

    constructor(routes: Route[]) {
        this.routes = routes;
        this.handler = new HistoryRoutesHandler(this.urlHandler.bind(this));

        document.addEventListener('DOMContentLoaded', () => {
            const historyState = history.state;
            this.handler.navigate(historyState);
            // this.redirectToMainPage();
        });
    }

    public navigate(url: string): void {
        this.handler.navigate(url);
    }

    // public redirectToMainPage(): void {
    //     // const saveState = new SaveState();
    //     // const filledOptions = saveState.getFilledOptions();
    //     const path = window.location.pathname;
    //     if (path === `/${PAGES.MAIN}`) {
    //         this.navigate(PAGES.MAIN);
    //     }
    // }

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
