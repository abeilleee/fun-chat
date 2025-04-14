import type { Options } from '../../utils/types';
import { View } from '../view';
import { FooterView } from './footer/footer';
import { HeaderView } from './header/header';

export class ChatView extends View {
    private header: HeaderView;
    private footer: FooterView;

    constructor() {
        const options: Options = {
            tagName: 'main',
            classes: ['main'],
        };
        super(options);
        this.header = new HeaderView(this.getHTMLElement());
        this.footer = new FooterView(this.getHTMLElement());
        this.configureView();
    }

    private configureView(): void {}
}
