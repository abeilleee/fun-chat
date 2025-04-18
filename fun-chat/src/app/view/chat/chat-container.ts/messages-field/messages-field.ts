import type { ClientApi } from '../../../../services/server-api/api';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT } from '../constants';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    private clientApi: ClientApi;
    private startWrapper: ElementCreator | null;
    private messagesHeader: MessagesHeader | null;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.startWrapper = null;
        this.messagesHeader = null;
        this.setEventListener();
        this.configure();
    }

    public configure(): void {
        this.messagesHeader = new MessagesHeader(this.getHTMLElement());
        this.startWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['start-wrapper', 'start-wrapper--active'],
            parent: this.getHTMLElement(),
            textContent: CHAT_INTRO_TEXT.SELECT,
        });
    }

    private setEventListener(): void {
        addEventListener('onselectedUserChanged', () => {
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.changeTextContent();
        });
    }

    private changeTextContent(): void {
        if (this.startWrapper) this.startWrapper.getElement().textContent = CHAT_INTRO_TEXT.WRITE;
    }
}
