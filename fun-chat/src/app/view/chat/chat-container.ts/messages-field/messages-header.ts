import { allUsers } from '../../../../services/state/reducers/users/user-states';
import { getCurrentUsername, getStorageData } from '../../../../services/storage/storage';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessagesHeader extends View {
    private userName: ElementCreator | null;

    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['messages-header'],
            parent: parent,
        };
        super(options);
        this.userName = null;
        this.setUserName();
        // this.setUserStatus('Online');
    }

    public setUserName(): void {
        addEventListener('onselectedUserChanged', () => {
            this.removeChildren();
            const login = allUsers.selectedUser.username;
            const status = allUsers.selectedUser.status;
            this.userName = new ElementCreator({
                tagName: 'p',
                classes: ['header-username'],
                textContent: `${login} ${status}`,
                parent: this.getHTMLElement(),
            });
        });
    }

    // public setUserStatus(status: string): void {
    //     const statusElement = new ElementCreator({
    //         tagName: 'p',
    //         classes: ['header-username'],
    //         textContent: status,
    //         parent: this.getHTMLElement(),
    //     });
    // }
}
