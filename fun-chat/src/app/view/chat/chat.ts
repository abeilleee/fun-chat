import type { Options } from '../../utils/types';
import { View } from '../view';
import { ChatContainerView } from './chat-container.ts/chat-container';
import { FooterView } from './footer/footer';
import { HeaderView } from './header/header';

export class ChatView extends View {
    private header: HeaderView;
    private chat: ChatContainerView;
    private footer: FooterView;

    constructor() {
        const options: Options = {
            tagName: 'main',
            classes: ['main'],
        };
        super(options);
        this.header = new HeaderView(this.getHTMLElement());
        this.chat = new ChatContainerView(this.getHTMLElement());
        this.footer = new FooterView(this.getHTMLElement());
        this.configureView();
    }

    private configureView(): void {}
}
