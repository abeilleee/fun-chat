import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';
import { ABOUT_INFORMATION } from './constants';

export class AboutView extends View {
    public router: Router;

    constructor(router: Router) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-about'],
        };
        super(options);
        this.router = router;
        this.configure();
    }

    private configure(): void {
        this.setContent();
    }

    private setContent(): HTMLElement {
        const box = new ElementCreator({
            tagName: 'div',
            classes: ['content-box'],
            parent: this.getHTMLElement(),
        });

        const textContent = new ElementCreator({
            tagName: 'p',
            classes: ['content-information'],
            textContent: ABOUT_INFORMATION,
            parent: box.getElement(),
        });

        const buttonBack = new Button(BUTTON_NAME.BACK, ['button-back'], box.getElement());

        return box.getElement();
    }
}
