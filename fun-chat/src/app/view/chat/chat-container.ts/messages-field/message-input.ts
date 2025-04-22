import { Button } from '../../../../components/buttons/buttons';
import { BUTTON_NAME } from '../../../../components/buttons/constants';
import { handlerBtnSend } from '../../../../components/buttons/handlers';
import { PLACEHOLDER } from '../../../../components/input/constants';
import { InputElement } from '../../../../components/input/input';
import type { ClientApi } from '../../../../services/server-api/client-api';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';
import { dialogWrapperHandler, handlerReadingMessages } from './handlers';

export class MessageInput extends View {
    private input: InputElement | null;
    private sendButton: Button | null;
    private clientApi: ClientApi;

    constructor(parent: HTMLElement, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-input-box', 'hidden'],
            parent: parent,
        };
        super(options);
        this.clientApi = clientApi;
        this.input = null;
        this.sendButton = null;
        this.configure(parent);
        this.addInputEventListener();
        this.addBtnEventListener();
    }

    private configure(parent: HTMLElement): void {
        this.input = new InputElement(PLACEHOLDER.WRITE, 'text', ['message-input'], this.getHTMLElement());
        this.sendButton = new Button(
            BUTTON_NAME.SEND,
            ['send-button', 'disabled'],
            this.getHTMLElement(),
            BUTTON_NAME.SEND
        );
    }

    private addInputEventListener(): void {
        this.input?.getElement().addEventListener('input', () => {
            const inputValue = this.input?.getValue() || '';
            this.sendButton?.setDisabled(inputValue.length === 0);
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const inputValue = this.input?.getValue() || '';
                this.sendButton?.setDisabled(inputValue.length === 0);
                const text = this.input?.getValue();
                if (text && text.trim().length !== 0) {
                    handlerBtnSend(text, this.clientApi);
                    this.input?.cleanInput();
                    this.sendButton?.setDisabled(true);
                }
            }
        });
    }

    private addBtnEventListener(): void {
        this.sendButton?.getElement().addEventListener('click', () => {
            this.addInputEventListener();
            const text = this.input?.getValue();
            if (text && text.trim().length !== 0) {
                handlerBtnSend(text, this.clientApi);
                this.input?.cleanInput();
                this.sendButton?.setDisabled(true);
                handlerReadingMessages(this.clientApi);
            }
        });
    }
}
