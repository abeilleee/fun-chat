import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogin } from '../../components/buttons/handlers';
import { InputElement } from '../../components/input/input';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';

export class LoginPageView extends View {
    public router: Router;
    private buttonsBox: ElementCreator | null;

    constructor(router: Router) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-auth'],
        };
        super(options);
        this.router = router;
        this.buttonsBox = null;
        this.configure();
        this.buttonsEventListeners();
    }

    private configure(): void {
        const form = this.createForm();
        const button = this.createButtons(form);
    }

    private createForm(): HTMLElement {
        const form = new ElementCreator<HTMLFormElement>({
            tagName: 'form',
            classes: ['form'],
            parent: this.getHTMLElement(),
        });

        const labelLogin = new ElementCreator<HTMLLabelElement>({
            tagName: 'label',
            classes: ['label', 'label-login'],
            parent: form.getElement(),
            textContent: 'Enter your login',
        }).getElement();

        if (labelLogin instanceof HTMLLabelElement) {
            labelLogin.htmlFor = 'Login';
        }

        const loginInput = new InputElement('Login', 'text', ['input-login'], form.getElement(), 'login');

        const labelPassword = new ElementCreator<HTMLLabelElement>({
            tagName: 'label',
            classes: ['label', 'label-password'],
            parent: form.getElement(),
            textContent: 'Enter your password',
        });

        const loginPassword = new InputElement('Login', 'text', ['input-password'], form.getElement(), 'password');

        return form.getElement();
    }

    private createButtons(parent: HTMLElement): HTMLElement {
        this.buttonsBox = new ElementCreator({
            tagName: 'div',
            classes: ['buttons-login-box'],
            parent: parent,
        });
        const loginButton = new Button(
            BUTTON_NAME.LOGIN,
            ['button-login'],
            this.buttonsBox.getElement(),
            BUTTON_NAME.LOGIN
        );
        const buttonAbout = new Button(
            BUTTON_NAME.ABOUT,
            ['button-about-auth'],
            this.buttonsBox.getElement(),
            BUTTON_NAME.ABOUT
        );
        return this.buttonsBox.getElement();
    }

    private buttonsEventListeners(): void {
        this.buttonsBox?.getElement().addEventListener('click', (event: MouseEvent) => {
            const targetElement = event?.target;

            if (targetElement instanceof HTMLElement) {
                const action = targetElement.getAttribute('data-action');

                switch (action) {
                    case 'About': {
                        event.preventDefault();
                        handlerBtnAbout(this.router);
                        break;
                    }
                    case 'Login': {
                        handlerBtnLogin(this.router);
                        break;
                    }
                }
            }
        });
    }
}
