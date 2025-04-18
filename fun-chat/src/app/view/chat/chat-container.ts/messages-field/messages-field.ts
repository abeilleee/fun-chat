import type { ClientApi } from '../../../../services/server-api/api';
import { dialogState } from '../../../../services/state/reducers/dialog/dialog-reducer';
import { ElementCreator } from '../../../../utils/element-creator';
import { generateId } from '../../../../utils/id-generator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT } from '../constants';
import { MessageElement } from './message';
import { MessageInput } from './message-input';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    private clientApi: ClientApi;
    private startWrapper: ElementCreator | null;
    private messagesHeader: MessagesHeader | null;
    private messagesInputBox: MessageInput | null;
    private newMessage: MessageElement;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.startWrapper = null;
        this.messagesHeader = null;
        this.messagesInputBox = null;
        this.newMessage = new MessageElement(this.getHTMLElement());
        this.setEventListener();
        this.handlerSendMsg();
        this.configure();
    }

    public configure(): void {
        this.messagesHeader = new MessagesHeader(this.getHTMLElement());
        this.startWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['start-wrapper', 'start-wrapper--active'],
            parent: this.getHTMLElement(),
            textContent: CHAT_INTRO_TEXT.SELECT,
        });
        this.messagesInputBox = new MessageInput(this.getHTMLElement(), this.clientApi);
    }

    private setEventListener(): void {
        addEventListener('onselectedUserChanged', () => {
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
            this.changeTextContent();
        });
    }

    private changeTextContent(): void {
        if (this.startWrapper) this.startWrapper.getElement().textContent = CHAT_INTRO_TEXT.WRITE;
    }

    private handlerSendMsg(): void {
        addEventListener('onMsgSend', () => {
            const id = generateId();
            const dialogs = dialogState;

            // const foundDialog = dialogs.find((dialog) => dialog.id === id);
            const foundDialog = dialogs[0];

            if (foundDialog && 'messages' in foundDialog) {
                const message = foundDialog.messages;
                this.newMessage?.createMessage(message[0]);
            }

            // this.newMessage?.createMessage();
        });
    }
}
