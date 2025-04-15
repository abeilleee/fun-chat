import { InputElement } from '../../../../components/input/input';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class Contacts extends View {
    public contactList: ElementCreator;
    private inputSearch: InputElement;

    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['contacts-box'],
            parent: parent,
        };

        super(options);
        this.inputSearch = new InputElement('Search...', 'search', ['input-search'], this.getHTMLElement());
        this.contactList = new ElementCreator({
            tagName: 'ul',
            classes: ['contacts-list'],
            parent: this.getHTMLElement(),
        });
        this.addContact('Mayya');
        this.addContact('Mayya');
        this.addContact('Mayya');
        this.addContact('Mayya');
        this.addContact('Mayya');
    }

    public addContact(userName: string): HTMLElement {
        const user = new ElementCreator({
            tagName: 'li',
            classes: ['user-element'],
            parent: this.contactList.getElement(),
            textContent: userName,
        });
        return user.getElement();
    }

    // private setSearchInput(parent: HTMLElement): HTMLElement {
    //     const inputSearch = new InputElement('Search...', 'search', ['input-search'], parent);
    //     return inputSearch.getElement();
    // }
}
