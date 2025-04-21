import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Message } from '../../../../services/server-api/types/chat';
import {
    dialogState,
    isDialog,
    isDialogToggler,
    isOpenChat,
    isOpenChatToggler,
} from '../../../../services/state/reducers/dialog/dialog-reducer';
import { selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';
import { ElementCreator } from '../../../../utils/element-creator';
import { formatTime } from '../../../../utils/format-time';
import { generateId } from '../../../../utils/id-generator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT, SEND } from '../constants';
import { dialogWrapperHandler } from './handlers';
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
        this.handlerSendMsg();
        this.configure();
        this.renderDialogHistory();
        this.showHeaderAndInput();
        this.setEventListeners();
    }

    public configure(): void {
        this.messagesHeader = new MessagesHeader(this.getHTMLElement());
        this.dialogWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['dialog-wrapper'],
            parent: this.getHTMLElement(),
            textContent: CHAT_INTRO_TEXT.SELECT,
        });
        this.messagesInputBox = new MessageInput(this.getHTMLElement(), this.clientApi);
        if (this.dialogWrapper)
            this.dialogWrapper.getElement().scrollTop = this.dialogWrapper?.getElement().scrollHeight;
    }

    private setEventListeners(): void {
        addEventListener('onSelectedUserChanged', () => {
            isOpenChatToggler(true);
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
            this.changeTextContent();
            this.setActiveWrapper();
        });

        addEventListener('onSelectedUserChanged', () => {
            this.renderDialogHistory();
        });

        addEventListener('onChangeChatHistory', () => {
            this.renderDialogHistory();
        });

        this.dialogWrapper?.getElement().addEventListener('click', () => {
            if (this.dialogWrapper?.getElement().classList.contains('dialog-wrapper--active')) {
                dialogWrapperHandler(this.clientApi);
            }
        });

        this.dialogWrapper?.getElement().addEventListener('scroll', () => {
            if (this.dialogWrapper?.getElement().classList.contains('dialog-wrapper--active')) {
                // console.log('scroll inside chat');
                dialogWrapperHandler(this.clientApi);
            }
        });
    }

    private changeTextContent(content: CHAT_INTRO_TEXT = CHAT_INTRO_TEXT.WRITE): void {
        if (this.dialogWrapper) {
            this.dialogWrapper.getElement().textContent = content;
        }
    }

    private createMessage(message: Message, className?: string): void {
        const messageWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['message-wrapper'],
            parent: this.dialogWrapper?.getElement(),
        });
        let msgStatus: boolean = false;
        if (className) {
            messageWrapper.getElement().classList.add(className);
            msgStatus = true;
        }

        this.createMessageElements(message, messageWrapper.getElement(), msgStatus);
    }

    private createMessageElements(message: Message, parent: HTMLElement, msgStatus: boolean): void {
        const messageBox = new ElementCreator({
            tagName: 'div',
            classes: ['message-box'],
            parent: parent,
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
            textContent: formatTime(Number(message.datetime)),
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
            textContent: msgStatus ? this.getMsgStatus(message) : '',
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
        const targetUser = selectedUser.username;
        const targetDialog = dialogState.find((dialog) => dialog.login === targetUser);

        if (targetDialog) {
            const messages: Message[] = targetDialog?.messages;
            if (messages.length > 0) {
                this.changeTextContent(CHAT_INTRO_TEXT.EMPTY);
                isDialogToggler(true);
            } else if (messages.length === 0) {
                isDialogToggler(false);
            }
            messages.forEach((message: Message) => {
                const className = message.from === targetUser ? '' : 'message-wrapper--right';
                this.createMessage(message, className);
            });
        }
        if (this.dialogWrapper)
            this.dialogWrapper.getElement().scrollTop = this.dialogWrapper?.getElement().scrollHeight;
    }

    private setActiveWrapper(): void {
        this.dialogWrapper?.getElement().classList.add('dialog-wrapper--active');
    }

    private showHeaderAndInput(): void {
        if (isOpenChat) {
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
            this.setActiveWrapper();
            if (!isDialog) {
                this.changeTextContent();
            }
        }
    }
}
