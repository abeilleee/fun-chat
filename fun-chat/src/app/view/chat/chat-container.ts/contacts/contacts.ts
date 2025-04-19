import { InputElement } from '../../../../components/input/input';
import type { ClientApi } from '../../../../services/server-api/api';
import { USER_STATUS } from '../../../../services/server-api/constants';
import { ElementCreator } from '../../../../utils/element-creator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { getAllUsers } from '../../../../services/state/reducers/users/user-states-reducer';
import type { User } from '../../../../services/server-api/types/user-actions';
import type { WebSocketConnection } from '../../../../services/web-socket-connection/web-socket-connection';
import { handleUserSelect } from './handlers';
import { PLACEHOLDER } from '../../../../components/input/constants';

export class Contacts extends View {
    public contactList: ElementCreator;
    private websocket: WebSocketConnection;
    private inputSearch: InputElement;
    private clientApi: ClientApi;
    private userBox: ElementCreator | null;

    constructor(parent: HTMLElement, clientApi: ClientApi, websocket: WebSocketConnection) {
        const options: Options = {
            tagName: 'div',
            classes: ['contacts-box'],
            parent: parent,
        };

        super(options);
        this.clientApi = clientApi;
        this.websocket = websocket;
        this.inputSearch = new InputElement(PLACEHOLDER.SEARCH, 'search', ['input-search'], this.getHTMLElement());
        this.contactList = new ElementCreator({
            tagName: 'ul',
            classes: ['contacts-list'],
            parent: this.getHTMLElement(),
        });
        this.userBox = null;
        this.renderContacts();
        this.addEventListeners();
    }

    public addContact(userName: User, status: USER_STATUS.ACTIVE | USER_STATUS.INACTIVE): void {
        this.userBox = new ElementCreator({
            tagName: 'li',
            classes: ['user-box'],
            parent: this.contactList.getElement(),
        });

        const indicator = new ElementCreator({
            tagName: 'div',
            classes: ['user-indicator'],
            parent: this.userBox.getElement(),
        });
        const additionalClass = status === USER_STATUS.ACTIVE ? 'user-indicator--online' : 'user-indicator--offline';
        indicator.getElement().classList.add(additionalClass);

        const user = new ElementCreator({
            tagName: 'li',
            classes: ['user-element'],
            parent: this.userBox.getElement(),
            textContent: userName.login ? userName.login : '',
        });
    }

    public renderContacts(): void {
        addEventListener('onAllUsersChange', () => {
            this.cleanContacts();
            const users = getAllUsers();
            const activeUsers = users.active;
            const inactiveUsers = users.inactive;
            activeUsers.forEach((user) => this.addContact(user, USER_STATUS.ACTIVE));
            inactiveUsers.forEach((user) => this.addContact(user, USER_STATUS.INACTIVE));
        });
    }

    private cleanContacts(): void {
        const contactList = this.contactList.getElement();
        while (contactList.firstChild) {
            contactList.removeChild(contactList.firstChild);
        }
    }

    private addEventListeners(): void {
        if (this.contactList) {
            this.contactList.getElement().addEventListener('click', (event) => {
                const targetElement = event.target;

                if (targetElement instanceof HTMLElement) {
                    handleUserSelect(targetElement, this.contactList.getElement());
                }
            });
        }
    }
}
