import { selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessagesHeader extends View {
    private userName: ElementCreator | null;

    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['messages-header', 'hidden'],
            parent: parent,
        };
        super(options);
        this.userName = null;
        this.configure();
        this.setEventListener();
    }

    private configure(): void {
        const text = selectedUser ? `${selectedUser.username} ${selectedUser.status}` : '';

        this.userName = new ElementCreator({
            tagName: 'p',
            classes: ['header-username'],
            textContent: text,
            parent: this.getHTMLElement(),
        });
    }

    private setEventListener(): void {
        addEventListener('onSelectedUserChanged', () => {
            const text = `${selectedUser.username} ${selectedUser.status}`;
            if (this.userName) this.userName.getElement().textContent = text;
        });
    }
}
