import { ContextMenu } from '../../../../components/context-menu.ts/context-menu';
import { renderMessages } from '../../../../services/custom-events/custom-events';
import type { ClientApi } from '../../../../services/client-api/client-api';
import type { Message } from '../../../../services/client-api/types/chat';
import {
    dialogState,
    isDialog,
    isDialogToggler,
    isOpenChat,
    isOpenChatToggler,
    unreadMessages,
} from '../../../../services/state/reducers/dialog/dialog-reducer';
import {
    isChatChange,
    isChatChangeToggler,
    selectedUser,
} from '../../../../services/state/reducers/users/user-states-reducer';
import { getCurrentUsername } from '../../../../services/storage/storage';
import { ElementCreator } from '../../../../utils/element-creator';
import { formatTime } from '../../../../utils/format-time';
import { scrollToBottom } from '../../../../utils/message-filled-utils';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { CHAT_INTRO_TEXT, STATUS } from '../constants';
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
    private delimeter: ElementCreator | null;
    private isDelimiter: boolean = false;

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
        this.delimeter = null;

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
        scrollToBottom(this.dialogWrapper.getElement());
    }

    private changeTextContent(content: CHAT_INTRO_TEXT = CHAT_INTRO_TEXT.WRITE): void {
        if (this.dialogWrapper && selectedUser.username.length > 0) {
            this.dialogWrapper.getElement().textContent = content;
        }
    }

    private createMessage(
        message: Message,
        edited: boolean,
        className?: string,
        idx?: number,
        firstUnread?: number
    ): void {
        const currentUser = getCurrentUsername();

        if (message.status?.isReaded === false && message.from !== currentUser && idx === firstUnread && isChatChange) {
            this.delimeter = new ElementCreator({
                tagName: 'div',
                classes: ['delimiter'],
                parent: this.dialogWrapper?.getElement(),
            });
            this.isDelimiter = true;
        }
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
                const { clientX, clientY } = event;
                if (!this.contextMenu.isOpen && this.messageBox) {
                    this.contextMenu.showMenu(clientX, clientY, message, this.clientApi, messageWrapper.getElement());
                }
                messageHandler(this.contextMenu);
            });
        }
    }

    private createMessageElements(message: Message, parent: HTMLElement, msgStatus: boolean, edited: boolean): void {
        this.messageBox = new ElementCreator({
            tagName: 'div',
            classes: ['message-box'],
            parent: parent,
        });

        this.createUpperBox(this.messageBox.getElement(), message);

        new ElementCreator({
            tagName: 'div',
            classes: ['message'],
            parent: this.messageBox.getElement(),
            textContent: message.text,
        });

        const lowerBox = new ElementCreator({
            tagName: 'div',
            classes: ['lower-box'],
            parent: this.messageBox.getElement(),
        });

        new ElementCreator({
            tagName: 'div',
            classes: ['status'],
            parent: lowerBox.getElement(),
            textContent: msgStatus ? this.getMsgStatus(message) : '',
        });
        if (edited) {
            this.setEditedStatus(lowerBox.getElement());
        }
    }

    private createUpperBox(parent: HTMLElement, message: Message): void {
        const upperBox = new ElementCreator({
            tagName: 'div',
            classes: ['upper-box'],
            parent: parent,
        });

        new ElementCreator({
            tagName: 'div',
            classes: ['sender'],
            parent: upperBox.getElement(),
            textContent: message.from,
        });

        new ElementCreator({
            tagName: 'div',
            classes: ['date'],
            parent: upperBox.getElement(),
            textContent: formatTime(Number(message.datetime)),
        });
    }

    private setEditedStatus(parent: HTMLElement, statusText = STATUS.EDITED): void {
        new ElementCreator({
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
            this.isDelimiter = false;
            if (this.dialogWrapper?.getElement().classList.contains('dialog-wrapper--active')) {
                handlerReadingMessages(this.clientApi);
            }
            isChatChangeToggler(false);

            addEventListener('onChangeChatHistory', () => {
                this.isDelimiter = false;
            });
        });
        addEventListener('connectionClosed', () => {
            isDialogToggler(false);
            isOpenChatToggler(false);
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
            const dialogs = dialogState;
            if (this.dialogWrapper && isDialog && selectedUser.username.length > 0) {
                this.dialogWrapper.getElement().textContent = CHAT_INTRO_TEXT.SELECT;
            }
            const foundDialog = dialogs.find((dialog) => dialog.login === selectedUser.username);
            if (foundDialog && 'messages' in foundDialog) {
                // eslint-disable-next-line unicorn/prefer-at
                const message: Message = foundDialog.messages[foundDialog.messages.length - 1];
                this.createMessage(message, false);
            }
        });
    }

    private renderDialogHistory(): void {
        if (selectedUser.username.length > 0 && isOpenChat) {
            const targetUser = selectedUser.username;
            const targetDialog = dialogState.find((dialog) => dialog.login === targetUser);

            if (targetDialog && selectedUser.username.length > 0) {
                const messages: Message[] = targetDialog?.messages;
                if (messages.length > 0 && selectedUser.username.length > 0) {
                    this.changeTextContent(CHAT_INTRO_TEXT.EMPTY);
                    isDialogToggler(true);
                } else if (messages.length === 0) {
                    isDialogToggler(false);
                }
                const firstUnread = messages.findIndex(
                    (message) => message.status?.isReaded === false && message.from !== getCurrentUsername()
                );
                messages.forEach((message: Message, idx: number) => {
                    const className = message.from === targetUser ? '' : 'message-wrapper--right';
                    let edited: boolean = false;
                    if (message.status?.isEdited) {
                        edited = true;
                    }

                    this.createMessage(message, edited, className, idx, firstUnread);
                });
            }
            if (this.dialogWrapper) scrollToBottom(this.dialogWrapper.getElement());
            if (this.isDelimiter && this.delimeter && this.dialogWrapper?.getElement()) {
                this.dialogWrapper
                    .getElement()
                    .scrollBy(
                        0,
                        this.delimeter.getElement().getBoundingClientRect().top -
                            this.dialogWrapper?.getElement().clientHeight
                    );
            }
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
}
