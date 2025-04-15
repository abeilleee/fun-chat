import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);

        const messagesHeader = new MessagesHeader(this.getHTMLElement());
    }
}
