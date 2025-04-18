import { getCurrentUsername, getStorageData } from '../../../../services/storage/storage';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessagesHeader extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['messages-header'],
            parent: parent,
        };
        super(options);
        // this.setUserName('Mayya');
        // this.setUserStatus('Online');
    }

    // public setUserName(username: string): void {
    //     const login = this.getUserName();
    //     const userName = new ElementCreator({
    //         tagName: 'p',
    //         classes: ['header-username'],
    //         textContent: login,
    //         parent: this.getHTMLElement(),
    //     });
    // }

    // public setUserStatus(status: string): void {
    //     const statusElement = new ElementCreator({
    //         tagName: 'p',
    //         classes: ['header-username'],
    //         textContent: status,
    //         parent: this.getHTMLElement(),
    //     });
    // }
}
