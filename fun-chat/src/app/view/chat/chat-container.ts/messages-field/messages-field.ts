import { ContextMenu } from '../../../../components/context-menu.ts/context-menu';
import { renderMessages } from '../../../../services/custom-events/custom-events';
import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Message } from '../../../../services/server-api/types/chat';
import {
    dialogState,
    isDialog,
    isDialogToggler,
    isOpenChat,
    isOpenChatToggler,
    unreadMessages,
} from '../../../../services/state/reducers/dialog/dialog-reducer';
import { allUsers, selectedUser } from '../../../../services/state/reducers/users/user-states-reducer';
import { ElementCreator } from '../../../../utils/element-creator';
import { formatTime } from '../../../../utils/format-time';
import { generateId } from '../../../../utils/id-generator';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT, SEND, STATUS } from '../constants';
import { handlerReadingMessages, messageHandler } from './handlers';
import { MessageInput } from './message-input';
import { MessagesHeader } from './messages-header';

export class MessageField extends View {
    private clientApi: ClientApi;
    private dialogWrapper: ElementCreator | null;
    private messagesHeader: MessagesHeader | null;
    private messagesInputBox: MessageInput | null;
    private messageBox: ElementCreator | null;
    private contextMenu: ContextMenu;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.dialogWrapper = null;
        this.messageBox = null;
        this.messagesHeader = null;
        this.messagesInputBox = null;
        this.contextMenu = new ContextMenu();

        this.handlerSendMsg();
        this.configure();
        this.showHeaderAndInput();
        this.renderDialogHistory();
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

    private changeTextContent(content: CHAT_INTRO_TEXT = CHAT_INTRO_TEXT.WRITE): void {
        if (this.dialogWrapper && selectedUser.username.length > 0) {
            this.dialogWrapper.getElement().textContent = content;
        }
    }

    private createMessage(message: Message, edited: boolean, className?: string): void {
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

        this.createMessageElements(message, messageWrapper.getElement(), msgStatus, edited);
        if (msgStatus) {
            messageWrapper.getElement().addEventListener('contextmenu', (event: MouseEvent) => {
                event.preventDefault();
                const targetElement = event.target;
                const { clientX, clientY } = event;
                if (!this.contextMenu.isOpen && this.messageBox) {
                    this.contextMenu.showMenu(clientX, clientY, message, this.clientApi, messageWrapper.getElement());
                }
                messageHandler(this.contextMenu, message, this.clientApi);
            });
        }
    }

    private createMessageElements(message: Message, parent: HTMLElement, msgStatus: boolean, edited: boolean): void {
        this.messageBox = new ElementCreator({
            tagName: 'div',
            classes: ['message-box'],
            parent: parent,
        });
        const upperBox = new ElementCreator({
            tagName: 'div',
            classes: ['upper-box'],
            parent: this.messageBox.getElement(),
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
            parent: this.messageBox.getElement(),
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
            parent: this.messageBox.getElement(),
        });
        const status = new ElementCreator({
            tagName: 'div',
            classes: ['status'],
            parent: lowerBox.getElement(),
            textContent: msgStatus ? this.getMsgStatus(message) : '',
        });
        if (edited) {
            this.setEditedStatus(lowerBox.getElement());
        }
    }

    private setEditedStatus(parent: HTMLElement, statusText = STATUS.EDITED): void {
        const status = new ElementCreator({
            tagName: 'div',
            classes: ['status-edit'],
            parent: parent,
            textContent: statusText,
        });
    }

    private setEventListeners(): void {
        addEventListener('onSelectedUserChanged', () => {
            isOpenChatToggler(true);
            if (selectedUser.username.length > 0) {
                this.messagesHeader?.getHTMLElement().classList.remove('hidden');
                this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
                this.changeTextContent();
                this.setActiveWrapper();
                this.renderDialogHistory();
            }
        });
        addEventListener('onChangeChatHistory', () => {
            unreadMessages();
            this.renderDialogHistory();
        });

        addEventListener('onDeleteMsg', () => {
            this.clearDialog();
            this.renderDialogHistory();
        });
        addEventListener('onEditMsg', () => {
            this.clearDialog();
            this.renderDialogHistory();
        });
        this.dialogWrapper?.getElement().addEventListener('click', () => {
            if (this.dialogWrapper?.getElement().classList.contains('dialog-wrapper--active')) {
                handlerReadingMessages(this.clientApi);
            }
        });
    }

    private getMsgStatus(message: Message): string {
        if (!message.status) {
            return STATUS.SEND;
        }

        if (message.status.isDelivered && message.status.isReaded) {
            return STATUS.IS_READED;
        }

        if (message.status.isDelivered) {
            return STATUS.IS_DELIVERED;
        }

        return STATUS.SEND;
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
                this.createMessage(message, false);
            }
        });
    }

    private renderDialogHistory(): void {
        if (selectedUser.username.length > 0 && isOpenChat) {
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
                    let edited: boolean = false;
                    if (message.status?.isEdited) {
                        edited = true;
                    }
                    this.createMessage(message, edited, className);
                });
            }
            if (this.dialogWrapper)
                this.dialogWrapper.getElement().scrollTop = this.dialogWrapper?.getElement().scrollHeight;

            dispatchEvent(renderMessages);
        }
    }

    private setActiveWrapper(): void {
        if (selectedUser.username.length > 0) {
            this.dialogWrapper?.getElement().classList.add('dialog-wrapper--active');
        } else {
            this.dialogWrapper?.getElement().classList.remove('dialog-wrapper--active');
        }
    }

    private showHeaderAndInput(): void {
        if (selectedUser.username.length > 0) {
            this.messagesHeader?.getHTMLElement().classList.remove('hidden');
            this.messagesInputBox?.getHTMLElement().classList.remove('hidden');
            this.setActiveWrapper();
        }
        if (!isDialog) {
            this.changeTextContent();
        }
    }

    private clearDialog(): void {
        while (this.dialogWrapper?.getElement().firstChild) {
            const child = this.dialogWrapper?.getElement().firstChild;
            if (child) this.dialogWrapper?.getElement().removeChild(child);
        }
    }

    private setDelimeter(parent: HTMLElement): void {
        const deleimeter = new ElementCreator({
            tagName: 'div',
            classes: ['delimeter'],
            parent: parent,
        });
    }
}
