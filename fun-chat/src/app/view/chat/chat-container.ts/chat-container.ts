import type { ClientApi } from '../../../services/client-api/client-api';
import { USER_STATUS } from '../../../services/client-api/constants';
import { ElementCreator } from '../../../utils/element-creator';
import type { Options } from '../../../utils/types';
import { ContainerView } from '../../container/container';
import { View } from '../../view';
import { Contacts } from './contacts/contacts';
import { MessageField } from './messages-field/messages-field';

export class ChatContainerView extends View {
    private clientApi: ClientApi;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-chat'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.configureView();
        this.setEventListeners();
    }

    private configureView(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        const chatWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['chat-wrapper'],
            parent: container.getHTMLElement(),
        });
        new Contacts(chatWrapper.getElement(), this.clientApi);
        new MessageField(chatWrapper.getElement(), this.clientApi);
    }

    private setEventListeners(): void {
        addEventListener('onLogin', () => {
            this.clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null);
            this.clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null);
        });
    }
}
