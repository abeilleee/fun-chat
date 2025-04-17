import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { SessionStorage } from '../../../../services/storage/storage';
import type { User } from '../../../../services/server-api/types/user-actions';

export class MessagesHeader extends View {
    private storage: SessionStorage;
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['messages-header'],
            parent: parent,
        };
        super(options);
        this.storage = new SessionStorage();
        this.setUserName('Mayya');
        this.setUserStatus('Online');
        this.getUserName();
    }

    public setUserName(username: string): void {
        const login = this.getUserName();
        const userName = new ElementCreator({
            tagName: 'p',
            classes: ['header-username'],
            textContent: login,
            parent: this.getHTMLElement(),
        });
    }

    public setUserStatus(status: string): void {
        const statusElement = new ElementCreator({
            tagName: 'p',
            classes: ['header-username'],
            textContent: status,
            parent: this.getHTMLElement(),
        });
    }

    private getUserName(): string | undefined {
        const userData = this.storage.getData();
        if (userData && 'login' in userData && typeof userData.login === 'string') {
            return userData.login;
        }
    }
}
