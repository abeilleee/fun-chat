import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogin } from '../../components/buttons/handlers';
import { InputElement } from '../../components/input/input';
import { AuthValidator } from '../../services/auth-validator/auth-validator';
import { VALID_LOGIN_PARAMS } from '../../services/auth-validator/constants';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';

export class LoginPageView extends View {
    public router: Router;
    private buttonsBox: ElementCreator | null;
    private loginInput: InputElement | null;
    private passwordInput: InputElement | null;
    private validator: AuthValidator;
    private loginErrorMessage: ElementCreator | null;
    private passwordErrorMessage: ElementCreator | null;

    constructor(router: Router) {
        const options: Options = {
            tagName: 'section',
            classes: ['section-auth'],
        };
        super(options);
        this.router = router;
        this.loginInput = null;
        this.passwordInput = null;
        this.buttonsBox = null;
        this.loginErrorMessage = null;
        this.passwordErrorMessage = null;
        this.validator = new AuthValidator();
        this.configure();
        this.setLoginInputListener();
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
        this.loginInput = new InputElement('Login', 'text', ['input-login'], form.getElement(), 'login');
        this.loginErrorMessage = new ElementCreator({
            tagName: 'span',
            classes: ['error-message'],
            parent: form.getElement(),
        });

        const labelPassword = new ElementCreator<HTMLLabelElement>({
            tagName: 'label',
            classes: ['label', 'label-password'],
            parent: form.getElement(),
            textContent: 'Enter your password',
        });

        this.passwordInput = new InputElement('Password', 'text', ['input-password'], form.getElement(), 'password');
        this.passwordErrorMessage = new ElementCreator({
            tagName: 'span',
            classes: ['error-message'],
            parent: form.getElement(),
        });

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

    private setLoginInputListener(): void {
        this.loginInput?.getElement().addEventListener('input', () => {
            if (this.loginInput) {
                const value = this.loginInput.getValue();
                this.cleanErrorMessage('login');

                if (value) {
                    let errorMessage: string | null = null;

                    const minLengthCheck = this.validator.checkMinLength(VALID_LOGIN_PARAMS.MIN_LENGTH, value);
                    if (typeof minLengthCheck === 'string') {
                        errorMessage = minLengthCheck;
                    } else {
                        const maxLengthCheck = this.validator.checkMaxLength(VALID_LOGIN_PARAMS.MAX_LENGTH, value);
                        if (typeof maxLengthCheck === 'string') {
                            errorMessage = maxLengthCheck;
                        } else {
                            const emptyCheck = this.validator.checkIsEmpty(value);
                            if (typeof emptyCheck === 'string') {
                                errorMessage = emptyCheck;
                            }
                        }
                    }
                    if (errorMessage) {
                        this.setErrorMessage(errorMessage, 'login');
                    }
                }
            }
        });
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

    private setErrorMessage(value: string, type: 'login' | 'password'): void {
        if (type === 'login' && this.loginErrorMessage && typeof value === 'string') {
            this.loginErrorMessage.getElement().textContent = value;
        } else if (type === 'password' && this.passwordErrorMessage && typeof value === 'string') {
            this.passwordErrorMessage.getElement().textContent = value;
        }
    }

    private cleanErrorMessage(type: 'login' | 'password'): void {
        if (type === 'login' && this.loginErrorMessage) {
            this.loginErrorMessage.getElement().textContent = '';
        } else if (type === 'password' && this.passwordErrorMessage) {
            this.passwordErrorMessage.getElement().textContent = '';
        }
    }
}
