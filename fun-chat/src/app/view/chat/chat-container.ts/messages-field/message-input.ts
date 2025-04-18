import { Button } from '../../../../components/buttons/buttons';
import { BUTTON_NAME } from '../../../../components/buttons/constants';
import { PLACEHOLDER } from '../../../../components/input/constants';
import { InputElement } from '../../../../components/input/input';
import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessageInput extends View {
    private input: InputElement | null;
    private sendButton: Button | null;

    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-input-box', 'hidden'],
            parent: parent,
        };
        super(options);
        this.input = null;
        this.sendButton = null;
        this.configure(parent);
        this.addEventListener();
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

    private addEventListener(): void {
        this.input?.getElement().addEventListener('input', () => {
            this.input?.getElement().addEventListener('input', () => {
                const inputValue = this.input?.getValue() || '';
                this.sendButton?.setDisabled(inputValue.length === 0);
            });
        });
    }
}
