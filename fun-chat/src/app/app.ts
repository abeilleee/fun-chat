import { Router } from './services/router/router';
import { PAGES, type Route } from './services/router/types';
import { Background } from './settings/background/background';
import { generateId } from './utils/id-generator';
import { ChatView } from './view/chat/chat';
import { MainView } from './view/main-view';
import type { View } from './view/view';
import { WebSocketConnection } from './services/web-socket-connection/web-socket-connection';
import { USER_STATUS } from './services/server-api/constants';
import { ClientApi } from './services/server-api/api';
import { getCurrentUsername, getPassword } from './services/storage/storage';
import { allUsers } from './services/state/reducers/users/user-states-reducer';
import { ConnectionWaiter } from './components/connection-waiter/connection-waiter';

export class App {
    public router: Router;
    private background: Background;
    private mainView: MainView | null;
    private chatPage: ChatView | null;
    private clientApi: ClientApi;
    private WebSocketConnection: WebSocketConnection;
    private connectionWaiter: ConnectionWaiter;

    constructor() {
        this.background = new Background();
        this.WebSocketConnection = new WebSocketConnection();
        this.mainView = null;
        this.chatPage = null;

        const routes = this.createRoutes();
        this.router = new Router(routes);
        this.clientApi = new ClientApi(this.WebSocketConnection);
        this.connectionWaiter = new ConnectionWaiter(this.WebSocketConnection);

        window.addEventListener('beforeunload', () => {
            const id = generateId();
            const login = getCurrentUsername();
            const password = getPassword();
            this.clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null, id);
            this.clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null, id);
            console.log('reload');
        });
        this.createView();

        console.log(allUsers);
    }

    private createView(): void {
        this.chatPage = new ChatView(this.router, this.WebSocketConnection);
        this.mainView = new MainView();
        if (this.mainView) document.body.append(this.mainView.getHTMLElement(), this.background.getHTMLElement());
    }

    private createRoutes(): Route[] {
        return [
            {
                path: ``,
                callback: async (): Promise<void> => {
                    const { LoginPageView } = await import('./view/auth/login');
                    this.setContent(new LoginPageView(this.router, this.WebSocketConnection));
                },
            },
            {
                path: `${PAGES.MAIN}`,
                callback: async (): Promise<void> => {
                    const { ChatView } = await import('./view/chat/chat');
                    this.setContent(new ChatView(this.router, this.WebSocketConnection));
                },
            },
            {
                path: `${PAGES.AUTH}`,
                callback: async (): Promise<void> => {
                    const { LoginPageView } = await import('./view/auth/login');
                    this.setContent(new LoginPageView(this.router, this.WebSocketConnection));
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

    private sendRequests(): void {
        window.addEventListener('beforeunload', () => {
            const id = generateId();
            const login = getCurrentUsername();
            const password = getPassword();
            this.clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null, id);
            this.clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null, id);
            console.log('reload');
        });
    }
}
