import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class Contacts extends View {
    public contactList: ElementCreator;
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['contacts-box'],
            parent: parent,
        };

        super(options);
        this.contactList = new ElementCreator<HTMLUListElement>({ tagName: 'ul', classes: ['contact-list'] });
        this.addContact('Mayya');
    }

    private addContact(userName: string): HTMLElement {
        const user = new ElementCreator({
            tagName: 'li',
            classes: ['user-element'],
            parent: this.contactList.getElement(),
            textContent: userName,
        });
        return user.getElement();
    }
}
