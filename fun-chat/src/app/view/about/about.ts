import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnBack } from '../../components/buttons/handlers';
import { ElementCreator } from '../../utils/element-creator';
import { View } from '../view';
import { ABOUT_INFORMATION } from './constants';
import type { Options } from '../../utils/types';
import type { Router } from '../../services/router/router';

export class AboutView extends View {
    public router: Router;
    private buttonBack: Button | null;

    constructor(router: Router) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-about'],
        };
        super(options);
        this.router = router;
        this.buttonBack = null;
        this.configure();
        this.buttonEventListeners();
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

        new ElementCreator({
            tagName: 'p',
            classes: ['content-information'],
            textContent: ABOUT_INFORMATION,
            parent: box.getElement(),
        });

        this.buttonBack = new Button(BUTTON_NAME.BACK, ['button-back'], box.getElement());

        return box.getElement();
    }

    private buttonEventListeners(): void {
        this.buttonBack?.getElement().addEventListener('click', () => {
            handlerBtnBack(this.router);
        });
    }
}
