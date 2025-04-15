import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { InputElement } from '../../components/input/input';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';

export class LoginPageView extends View {
    public router: Router;

    constructor(router: Router) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-auth'],
        };
        super(options);
        this.router = router;
        this.configure();
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
        const loginButton = new Button(BUTTON_NAME.LOGIN, ['button-login'], parent);
        return loginButton.getElement();
    }
}
