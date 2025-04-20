import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Message } from '../../../../services/server-api/types/chat';
import { dialogState } from '../../../../services/state/reducers/dialog/dialog-reducer';
import { selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';
import { ElementCreator } from '../../../../utils/element-creator';
import { generateId } from '../../../../utils/id-generator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT, SEND } from '../constants';
import { MessageInput } from './message-input';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    private clientApi: ClientApi;
    private dialogWrapper: ElementCreator | null;
    private messagesHeader: MessagesHeader | null;
    private messagesInputBox: MessageInput | null;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.dialogWrapper = null;
        this.messagesHeader = null;
        this.messagesInputBox = null;
        this.setEventListener();
        this.handlerSendMsg();
        this.configure();
        this.renderDialogHistory();
    }

    public configure(): void {
        this.messagesHeader = new MessagesHeader(this.getHTMLElement());
        this.dialogWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['start-wrapper', 'start-wrapper--active'],
            parent: this.getHTMLElement(),
            textContent: CHAT_INTRO_TEXT.SELECT,
        });
        this.messagesInputBox = new MessageInput(this.getHTMLElement(), this.clientApi);
    }

    private setEventListener(): void {
        addEventListener('onSelectedUserChanged', () => {
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
            this.changeTextContent();
        });
    }

    private changeTextContent(): void {
        if (this.dialogWrapper) this.dialogWrapper.getElement().textContent = CHAT_INTRO_TEXT.WRITE;
    }

    private createMessage(message: Message, className?: 'left' | 'right'): void {
        const messageBox = new ElementCreator({
            tagName: 'div',
            classes: ['message-box'],
            parent: this.dialogWrapper?.getElement(),
        });
        const upperBox = new ElementCreator({
            tagName: 'div',
            classes: ['upper-box'],
            parent: messageBox.getElement(),
        });
        const sender = new ElementCreator({
            tagName: 'div',
            classes: ['sender'],
            parent: upperBox.getElement(),
            textContent: message.from,
        });
        const messageField = new ElementCreator({
            tagName: 'div',
            classes: ['message'],
            parent: messageBox.getElement(),
            textContent: message.text,
        });
        const date = new ElementCreator({
            tagName: 'div',
            classes: ['date'],
            parent: upperBox.getElement(),
            textContent: String(message.datetime),
        });
        const lowerBox = new ElementCreator({
            tagName: 'div',
            classes: ['lower-box'],
            parent: messageBox.getElement(),
        });
        const status = new ElementCreator({
            tagName: 'div',
            classes: ['status'],
            parent: lowerBox.getElement(),
            textContent: this.getMsgStatus(message) || '',
        });
    }

    private getMsgStatus(message: Message): string | undefined {
        if (message.status) {
            for (const [key, value] of Object.entries(message.status)) {
                if (value === true) {
                    return key;
                }
            }
            return SEND;
        }
    }

    private handlerSendMsg(): void {
        addEventListener('onMsgSend', () => {
            const id = generateId();
            const dialogs = dialogState;
            if (this.dialogWrapper) {
                this.dialogWrapper.getElement().textContent = '';
            }
            const foundDialog = dialogs.find((dialog) => dialog.login === selectedUser.username);
            if (foundDialog && 'messages' in foundDialog) {
                const message: Message = foundDialog.messages[foundDialog.messages.length - 1];
                this.createMessage(message);
            }
        });
    }

    private renderDialogHistory(): void {
        addEventListener('onSelectedUserChanged', () => {
            const targetUser = selectedUser.username;
            const targetDialog = dialogState.find((dialog) => dialog.login === targetUser);
            console.log('render dialog history');
            console.log('targetDialog: ', targetDialog);
        });
    }
}
