import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';

export class InputElement extends ElementCreator<HTMLInputElement> {
    private placeholder: string;
    private type: string;

    constructor(placeholder: string, type: string, classes?: string[], parent?: HTMLElement, id?: string) {
        const options: Options = {
            tagName: 'input',
            classes: classes ? ['input', ...classes] : ['input'],
            parent: parent,
            id: id,
        };

        super(options);

        this.placeholder = placeholder;
        this.type = type;
        this.setPlaceholder();
        this.setType();
    }

    private setPlaceholder(): void {
        const inputElement = this.getElement();
        if (inputElement instanceof HTMLInputElement) {
            inputElement.placeholder = this.placeholder;
        }
    }

    private setType(): void {
        const inputElement = this.getElement();
        if (inputElement instanceof HTMLInputElement) {
            inputElement.type = this.type;
        }
    }
}
