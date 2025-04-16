import { Router } from './services/router/router';
import { PAGES, type Route } from './services/router/types';
import { Background } from './settings/background/background';
import { AboutView } from './view/about/about';
import { LoginPageView } from './view/auth/login';
import { ChatView } from './view/chat/chat';
import { MainView } from './view/main-view';
import { NotFoundView } from './view/not-found/not-found';
import type { View } from './view/view';
import { WebSocketConnection } from './web-socket-connection/web-socket-connection';

export class App {
    public router: Router;
    private background: Background;
    private mainView: MainView | null;
    private chatPage: ChatView | null;
    private WebSocketConnection: WebSocketConnection;

    constructor() {
        const routes = this.createRoutes();
        this.router = new Router(routes);
        this.background = new Background();
        this.WebSocketConnection = new WebSocketConnection();
        this.mainView = null;
        this.chatPage = null;
        this.createView();
    }

    private createView(): void {
        this.chatPage = new ChatView(this.router);
        this.mainView = new MainView();
        if (this.mainView) document.body.append(this.background.getHTMLElement(), this.mainView.getHTMLElement());
    }

    private createRoutes(): Route[] {
        return [
            {
                path: ``,
                callback: async (): Promise<void> => {
                    const { ChatView } = await import('./view/chat/chat');
                    this.setContent(new ChatView(this.router));
                },
            },
            {
                path: `${PAGES.MAIN}`,
                callback: async (): Promise<void> => {
                    const { ChatView } = await import('./view/chat/chat');
                    this.setContent(new ChatView(this.router));
                },
            },
            {
                path: `${PAGES.AUTH}`,
                callback: async (): Promise<void> => {
                    const { LoginPageView } = await import('./view/auth/login');
                    this.setContent(new LoginPageView(this.router));
                },
            },
            {
                path: `${PAGES.ABOUT}`,
                callback: async (): Promise<void> => {
                    const { AboutView } = await import('./view/about/about');
                    this.setContent(new AboutView(this.router));
                },
            },
            {
                path: `${PAGES.NOT_FOUND}`,
                callback: async (): Promise<void> => {
                    const { NotFoundView } = await import('./view/not-found/not-found');
                    this.setContent(new NotFoundView(this.router));
                },
            },
        ];
    }

    private setContent(view: View): void {
        if (this.mainView !== null) {
            const HTMLElement = this.mainView.getHTMLElement();
            while (HTMLElement.firstChild) {
                HTMLElement.removeChild(HTMLElement.firstChild);
            }
            this.mainView.getHTMLElement().append(view.getHTMLElement());
        }
    }
}
