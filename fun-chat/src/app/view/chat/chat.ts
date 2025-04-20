import type { Router } from '../../services/router/router';
import type { ClientApi } from '../../services/server-api/client-api';
import type { WebSocketConnection } from '../../services/web-socket-connection/web-socket-connection';
import type { Options } from '../../utils/types';
import { View } from '../view';
import { ChatContainerView } from './chat-container.ts/chat-container';
import { FooterView } from './footer/footer';
import { HeaderView } from './header/header';

export class ChatView extends View {
    public router: Router;
    private clientApi: ClientApi;
    private header: HeaderView;
    private chat: ChatContainerView;
    private footer: FooterView;

    constructor(router: Router, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-main'],
        };
        super(options);
        this.router = router;
        this.clientApi = clientApi;
        this.header = new HeaderView(this.getHTMLElement(), this.router, this.clientApi);
        this.chat = new ChatContainerView(this.getHTMLElement(), this.clientApi);
        this.footer = new FooterView(this.getHTMLElement());
        this.configureView();
    }

    private configureView(): void {}
}
