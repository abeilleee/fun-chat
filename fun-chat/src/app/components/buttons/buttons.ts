import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';

type OptionsBtn = {
    attr: string;
};

export class Button extends ElementCreator<HTMLButtonElement> {
    constructor(text: string, classes?: string[], parent?: HTMLElement, attr?: string) {
        const options: Options | OptionsBtn = {
            tagName: 'button',
            classes: classes ? ['button', ...classes] : ['button'],
            textContent: text,
            parent: parent,
            attr: attr,
        };
        super(options);
    }

    public setDisabled(option: boolean): void {
        if (option) {
            this.getElement().classList.add('disabled');
            return;
        }
        this.getElement().classList.remove('disabled');
    }
}
