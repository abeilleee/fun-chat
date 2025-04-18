import type { ClientApi } from '../../../../services/server-api/api';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    private clientApi: ClientApi;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;

        const messagesHeader = new MessagesHeader(this.getHTMLElement());
    }
}
