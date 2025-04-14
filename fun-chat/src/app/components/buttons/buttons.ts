import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';

export class Button extends ElementCreator<HTMLButtonElement> {
    constructor(text: string, classes?: string[], parent?: HTMLElement) {
        const options: Options = {
            tagName: 'button',
            classes: classes ? ['button', ...classes] : ['button'],
            textContent: text,
            parent: parent,
        };
        super(options);
    }

    public disableBtn(btn: HTMLElement): void {
        btn.classList.add('disabled');
    }
}
