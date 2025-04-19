import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnBack } from '../../components/buttons/handlers';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';

export class NotFoundView extends View {
    public router: Router;
    private buttonBack: Button | null;
    #default_text = 'Error. Page not found';

    constructor(router: Router) {
        const options: Options = {
            tagName: 'main',
            classes: ['not-found'],
        };
        super(options);
        this.router = router;
        this.configureView();
        this.buttonBack = null;
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

        this.buttonBack = new Button(BUTTON_NAME.BACK, ['not-found-btn-back'], box.getElement());
        this.addEventListener();
    }

    private addEventListener(): void {
        this.buttonBack?.getElement().addEventListener('click', () => {
            handlerBtnBack(this.router);
        });
    }
}
