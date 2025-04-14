import type { Options } from '../../../utils/types';
import { ContainerView } from '../../container/container';
import { View } from '../../view';
import { Contacts } from './contacts/contacts';

export class ChatContainerView extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['chat-wrapper'],
            parent: parent,
        };
        super(options);

        this.configureView();
    }

    private configureView(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        const contactsList = new Contacts(container.getHTMLElement());
    }

    private appendElements(): void {}
}
