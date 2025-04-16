import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogin } from '../../components/buttons/handlers';
import { InputElement } from '../../components/input/input';
import { AuthValidator } from '../../services/auth-validator/auth-validator';
import { INPUT_TYPE } from '../../services/auth-validator/constants';
import type { Router } from '../../services/router/router';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';
import { loginInputHandlers } from './handlers';

export class LoginPageView extends View {
    public router: Router;
    private buttonsBox: ElementCreator | null;
    private loginInput: InputElement | null;
    private passwordInput: InputElement | null;
    private validator: AuthValidator;
    private loginErrorMessage: ElementCreator | null;
    private passwordErrorMessage: ElementCreator | null;
    private loginButton: Button | null;
    private isValidLogin: boolean = false;
    private isValidPassword: boolean = false;

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
        this.loginButton = null;
        this.validator = new AuthValidator();
        this.configure();
        this.setLoginInputListener();
        this.setPasswordInputListener();
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
        this.loginButton = new Button(
            BUTTON_NAME.LOGIN,
            ['button-login', 'disabled'],
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
                this.cleanErrorMessage(INPUT_TYPE.LOGIN);
                const result = loginInputHandlers(this.loginInput, this.validator);

                if (typeof result === 'string') {
                    this.setErrorMessage(result, INPUT_TYPE.LOGIN);
                    this.loginButton?.setDisabled(true);
                    console.log('invalid login');
                    this.isValidLogin = false;
                } else {
                    this.isValidLogin = true;
                    console.log('valid login');
                    this.isValidLogin = true;
                }
            }
        });
    }

    private setPasswordInputListener(): void {
        this.passwordInput?.getElement().addEventListener('input', () => {
            if (this.passwordInput) {
                const value = this.passwordInput.getValue();
                this.cleanErrorMessage(INPUT_TYPE.PASSWORD);

                if (value) {
                    let errorMessage: string | null = null;

                    const minLengthCheck = this.validator.checkMinLength(value, INPUT_TYPE.PASSWORD);
                    if (typeof minLengthCheck === 'string') {
                        console.log('HERE');
                        errorMessage = minLengthCheck;
                    } else {
                        const maxLengthCheck = this.validator.checkMaxLength(value, INPUT_TYPE.PASSWORD);
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
                        this.setErrorMessage(errorMessage, INPUT_TYPE.PASSWORD);
                    } else {
                        this.isValidPassword = true;
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
                        handlerBtnLogin(this.router, this.isValidLogin, this.isValidPassword);
                        break;
                    }
                }
            }
        });
    }

    private setErrorMessage(value: string, type: INPUT_TYPE): void {
        if (type === INPUT_TYPE.LOGIN && this.loginErrorMessage && typeof value === 'string') {
            this.loginErrorMessage.getElement().textContent = value;
        } else if (type === INPUT_TYPE.PASSWORD && this.passwordErrorMessage && typeof value === 'string') {
            this.passwordErrorMessage.getElement().textContent = value;
        }
    }

    private cleanErrorMessage(type: INPUT_TYPE): void {
        if (type === INPUT_TYPE.LOGIN && this.loginErrorMessage) {
            this.loginErrorMessage.getElement().textContent = '';
        } else if (type === INPUT_TYPE.PASSWORD && this.passwordErrorMessage) {
            this.passwordErrorMessage.getElement().textContent = '';
        }
    }
}
