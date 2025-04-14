import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';

export class NotFoundView extends View {
    #default_text = 'Error. Page not found';

    constructor() {
        const options: Options = {
            tagName: 'main',
            classes: ['not-found'],
        };
        super(options);
        this.configureView();
    }

    private configureView(): void {
        const box = new ElementCreator({
            tagName: 'div',
            classes: ['not-found-box'],
            parent: this.getHTMLElement(),
        });

        const text = new ElementCreator({
            tagName: 'h1',
            classes: ['title', 'title-not-found'],
            textContent: this.#default_text,
            parent: box.getElement(),
        });

        const buttonBack = new Button(BUTTON_NAME.BACK, ['not-found-btn-back'], box.getElement());
    }
}
