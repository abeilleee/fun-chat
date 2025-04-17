import { ElementCreator } from '../../../utils/element-creator';
import type { Options } from '../../../utils/types';
import { ContainerView } from '../../container/container';
import { View } from '../../view';
import { Contacts } from './contacts/contacts';
import { MessageField } from './messages-field/messages-field';

export class ChatContainerView extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-chat'],
            parent: parent,
        };
        super(options);

        this.configureView();
    }

    private configureView(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        const chatWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['chat-wrapper'],
            parent: container.getHTMLElement(),
        });
        const contactsList = new Contacts(chatWrapper.getElement());
        const messageField = new MessageField(chatWrapper.getElement());
    }
}
