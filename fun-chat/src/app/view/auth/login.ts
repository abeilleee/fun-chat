import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogin } from '../../components/buttons/handlers';
import { PLACEHOLDER } from '../../components/input/constants';
import { InputElement } from '../../components/input/input';
import { AuthValidator } from '../../services/auth-validator/auth-validator';
import { EMPTY, INPUT_TYPE } from '../../services/auth-validator/constants';
import type { Router } from '../../services/router/router';
import type { ClientApi } from '../../services/server-api/client-api';
import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { View } from '../view';
import { loginHandler, passwordHandler } from './handlers';

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
    private clientApi: ClientApi;

    constructor(router: Router, clientApi: ClientApi) {
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
        this.clientApi = clientApi;
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
        const header = new ElementCreator({
            tagName: 'h3',
            classes: ['title-auth'],
            textContent: 'FUN CHAT',
            parent: form.getElement(),
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
        this.loginInput = new InputElement(PLACEHOLDER.LOGIN, 'text', ['input-login'], form.getElement(), 'login');
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
        this.passwordInput = new InputElement(
            PLACEHOLDER.PASSWORD,
            'password',
            ['input-password'],
            form.getElement(),
            'password'
        );
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
            if (this.loginInput && this.loginButton) {
                this.cleanErrorMessage(INPUT_TYPE.LOGIN);
                const result = loginHandler(this.loginInput, this.validator, this.loginButton);

                if (typeof result === 'string' && result !== EMPTY) {
                    this.setErrorMessage(result, INPUT_TYPE.LOGIN);
                    this.isValidLogin = false;
                } else if (result && result === EMPTY) {
                    this.isValidLogin = false;
                } else {
                    this.isValidLogin = true;
                }
            }
            if (this.loginButton) this.validator.checkValid(this.isValidLogin, this.isValidPassword, this.loginButton);
        });
    }

    private setPasswordInputListener(): void {
        this.passwordInput?.getElement().addEventListener('input', () => {
            if (this.passwordInput && this.loginButton) {
                this.cleanErrorMessage(INPUT_TYPE.PASSWORD);
                const result = passwordHandler(this.passwordInput, this.validator);

                if (typeof result === 'string' && result !== EMPTY) {
                    this.setErrorMessage(result, INPUT_TYPE.PASSWORD);
                    this.isValidPassword = false;
                } else if (result && result === EMPTY) {
                    this.isValidPassword = false;
                } else {
                    this.isValidPassword = true;
                }
            }
            if (this.loginButton) this.validator.checkValid(this.isValidLogin, this.isValidPassword, this.loginButton);
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
                        const login = this.loginInput?.getValue();
                        const password = this.passwordInput?.getValue();
                        if (login && password)
                            handlerBtnLogin(
                                this.router,
                                this.isValidLogin,
                                this.isValidPassword,
                                login,
                                password,
                                this.clientApi
                            );
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
