import { InputElement } from '../../../../components/input/input';
import { USER_STATUS } from '../../../../services/client-api/constants';
import { ElementCreator } from '../../../../utils/element-creator';
import { View } from '../../../view';
import { allUsers, getAllUsers, selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';
import { handleUserSelect } from './handlers';
import { PLACEHOLDER } from '../../../../components/input/constants';
import {
    pendingRequests,
    unreadMessages,
    unreadMessagesNumber,
} from '../../../../services/state/reducers/dialog/dialog-reducer';
import { generateId } from '../../../../utils/id-generator';
import type { ClientApi } from '../../../../services/client-api/client-api';
import type { Options } from '../../../../utils/types';
import type { User } from '../../../../services/client-api/types/user';
import type { AllUsers } from '../../../../services/state/reducers/users/types';

export class Contacts extends View {
    public contactList: ElementCreator;
    private inputSearch: InputElement;
    private clientApi: ClientApi;
    private userBox: ElementCreator | null;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['contacts-box'],
            parent: parent,
        };

        super(options);
        this.clientApi = clientApi;
        this.inputSearch = new InputElement(PLACEHOLDER.SEARCH, 'search', ['input-search'], this.getHTMLElement());
        this.contactList = new ElementCreator({
            tagName: 'ul',
            classes: ['contacts-list'],
            parent: this.getHTMLElement(),
        });
        this.userBox = null;
        unreadMessages();
        this.renderContacts();
        this.setEventListeners();
    }

    public addContact(userName: User, status: USER_STATUS.ACTIVE | USER_STATUS.INACTIVE, unreadCount?: number): void {
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

        new ElementCreator({
            tagName: 'li',
            classes: ['user-element'],
            parent: this.userBox.getElement(),
            textContent: userName.login ? userName.login : '',
        });

        if (unreadCount && unreadCount !== 0) {
            this.setUnreadMessagesIndicator(this.userBox.getElement(), unreadCount);
        }
    }

    public filterContacts(): AllUsers | undefined {
        const searchStr = this.inputSearch.getValue();
        const allUsers = getAllUsers();

        if (searchStr)
            return {
                active: allUsers.active.filter((user) => user.login.toLowerCase().includes(searchStr.toLowerCase())),
                inactive: allUsers.inactive.filter((user) =>
                    user.login.toLowerCase().includes(searchStr.toLowerCase())
                ),
            };
    }

    public renderContacts(filter?: boolean): void {
        unreadMessages();
        this.cleanContacts();
        const users: AllUsers | undefined = filter ? this.filterContacts() : getAllUsers();

        if (users) {
            const activeUsers = users.active;
            const inactiveUsers = users.inactive;
            const allUsers = [...activeUsers, ...inactiveUsers];
            allUsers.forEach((user) => {
                const unreadCount =
                    unreadMessagesNumber.find((item) => item.username === user.login)?.unreadMessages || 0;
                const userStatus = activeUsers.includes(user) ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
                this.addContact(user, userStatus, unreadCount);
            });
        }
    }

    private setUnreadMessagesIndicator(parent: HTMLElement, unreadCount: number): void {
        new ElementCreator({
            tagName: 'div',
            classes: ['messages-indicator'],
            parent: parent,
            textContent: String(unreadCount),
        });
    }

    private cleanContacts(): void {
        const contactList = this.contactList.getElement();
        while (contactList.firstChild) {
            contactList.removeChild(contactList.firstChild);
        }
    }

    private setEventListeners(): void {
        if (this.contactList) {
            this.contactList.getElement().addEventListener('click', (event) => {
                const targetElement = event.target;

                if (targetElement instanceof HTMLElement) {
                    handleUserSelect(targetElement);
                }
            });
        }
        addEventListener('selectUser', () => {
            const id = generateId();
            this.clientApi.requestChatHistory(selectedUser.username, id);
        });
        addEventListener('onAllUsersChange', () => {
            const users = [...allUsers.active, ...allUsers.inactive];
            users.forEach((user) => {
                const id = generateId();
                const username = user.login;
                pendingRequests.push({ requestId: id, username: username });
                this.clientApi.requestChatHistory(username, id);
            });
        });
        addEventListener('onGetNewMessages', () => {
            unreadMessages();
            this.renderContacts();
        });
        addEventListener('onChangeChatHistory', () => {
            this.renderContacts();
        });

        this.inputSearch.getElement().addEventListener('input', () => {
            const value = this.inputSearch.getValue();
            if (value) {
                this.renderContacts(true);
            } else if (value === '') {
                this.renderContacts();
            }
        });
    }
}
