import type { ClientApi } from '../../services/client-api/client-api';
import type { Message } from '../../services/client-api/types/chat';
import { ElementCreator } from '../../utils/element-creator';
import { Button } from '../buttons/buttons';
import { BUTTON_NAME } from '../buttons/constants';
import { CONTEXT_MENU_WIDTH } from './constants';

export class ContextMenu {
    public isOpen = false;
    private menu: ElementCreator | null;
    private btnDelete: ElementCreator | null;
    private btnEdit: ElementCreator | null;

    constructor() {
        this.menu = null;
        this.btnDelete = null;
        this.btnEdit = null;
    }

    public showMenu(
        clientX: number,
        clientY: number,
        message: Message,
        clientApi: ClientApi,
        messageBox: HTMLElement
    ): void {
        this.menu = new ElementCreator({ tagName: 'div', classes: ['context-menu'], parent: document.body });
        this.btnDelete = new Button(BUTTON_NAME.DELETE, ['button-delete'], this.menu.getElement());
        this.btnEdit = new Button(BUTTON_NAME.EDIT, ['button-edit'], this.menu.getElement());
        const offsetX = clientX - CONTEXT_MENU_WIDTH;
        const currentMsgId = message.id;
        this.menu.getElement().style.left = `${offsetX}px`;
        this.menu.getElement().style.top = `${clientY}px`;
        this.isOpen = true;

        if (currentMsgId) {
            this.setEventListeners(clientApi, currentMsgId, messageBox);
        }
    }

    public closeMenu(): void {
        if (this.menu) {
            this.menu.getElement().remove();
        }
        this.isOpen = false;
    }

    private setEventListeners(clientApi: ClientApi, msgId: string, messageBox: HTMLElement): void {
        this.btnDelete?.getElement().addEventListener('click', () => {
            clientApi.deleteMsg(msgId);
        });

        this.btnEdit?.getElement().addEventListener('click', () => {
            const messageField = messageBox.querySelector('.message');

            const textArea = new ElementCreator({
                tagName: 'textarea',
                classes: ['message-area'],
                textContent: messageField?.textContent || '',
            }).getElement();

            if (textArea instanceof HTMLElement) messageField?.replaceWith(textArea);
            textArea.focus();

            textArea.addEventListener('blur', () => {
                if (textArea instanceof HTMLTextAreaElement) {
                    const newText = textArea.value;
                    const messageField = new ElementCreator({
                        tagName: 'div',
                        classes: ['message'],
                        textContent: newText || '',
                    }).getElement();

                    if (newText) clientApi.editMessage(msgId, newText);
                    textArea.replaceWith(messageField);
                }
            });

            this.closeMenu();
        });
    }
}
