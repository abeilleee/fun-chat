import { Message } from '../../../../services/server-api/types/user-actions';
import { ElementCreator } from '../../../../utils/element-creator';
import { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessageElement extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-box'],
            parent: parent,
        };
        super(options);
    }

    public createMessage(message: Message) {
        const upperBox = new ElementCreator({ tagName: 'div', classes: ['upper-box'], parent: this.getHTMLElement() });
        const sender = new ElementCreator({
            tagName: 'div',
            classes: ['sender'],
            parent: upperBox.getElement(),
            textContent: message.from,
        });
        const messageField = new ElementCreator({
            tagName: 'div',
            classes: ['message-field'],
            parent: this.getHTMLElement(),
            textContent: message.text,
        });
        const date = new ElementCreator({
            tagName: 'div',
            classes: ['date'],
            parent: upperBox.getElement(),
            textContent: String(message.datetime),
        });
        const lowerBox = new ElementCreator({ tagName: 'div', classes: ['lower-box'], parent: this.getHTMLElement() });
        const status = new ElementCreator({ tagName: 'div', classes: ['status'], parent: lowerBox.getElement() });
    }

    public createSender(senderName: string = 'you'): void {
        const sender = new ElementCreator({ tagName: 'p', classes: ['sender'], textContent: senderName });
    }

    public createDate(message: Message): void {
        const date = message.datetime;
    }
}
