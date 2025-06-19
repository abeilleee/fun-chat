import { Button } from '../../components/buttons/buttons';
import { BUTTON_NAME } from '../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogin } from '../../components/buttons/handlers';
import { PLACEHOLDER } from '../../components/input/constants';
import { InputElement } from '../../components/input/input';
import { AuthValidator } from '../../services/auth-validator/auth-validator';
import { EMPTY, INPUT_TYPE } from '../../services/auth-validator/constants';
import { PAGES } from '../../services/router/types';
import { USER_STATUS } from '../../services/client-api/constants';
import { setData } from '../../services/storage/storage';
import { ElementCreator } from '../../utils/element-creator';
import { View } from '../view';
import { loginHandler, passwordHandler } from './handlers';
import type { Options } from '../../utils/types';
import type { User } from '../../services/client-api/types/user';
import type { ClientApi } from '../../services/client-api/client-api';
import type { Router } from '../../services/router/router';

export class LoginPageView extends View {
    public router: Router;
    private formElement: ElementCreator | null;
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
        this.formElement = null;
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
        this.addLoginBtnEventListener();
        this.setEventListener();
    }

    private configure(): void {
        const form = this.createForm();
        this.createButtons(form);
    }

    private createForm(): HTMLElement {
        this.formElement = new ElementCreator<HTMLFormElement>({
            tagName: 'form',
            classes: ['form'],
            parent: this.getHTMLElement(),
        });

        this.createLoginElements(this.formElement.getElement());
        this.createPasswordElements(this.formElement.getElement());

        return this.formElement.getElement();
    }

    private createLoginElements(parent: HTMLElement): void {
        new ElementCreator({
            tagName: 'h3',
            classes: ['title-auth'],
            textContent: 'FUN CHAT',
            parent: parent,
        });
        const labelLogin = new ElementCreator<HTMLLabelElement>({
            tagName: 'label',
            classes: ['label', 'label-login'],
            parent: parent,
            textContent: 'Enter your login',
        }).getElement();
        if (labelLogin instanceof HTMLLabelElement) {
            labelLogin.htmlFor = 'Login';
        }
        this.loginInput = new InputElement(PLACEHOLDER.LOGIN, 'text', ['input-login'], parent, 'login');
        this.loginErrorMessage = new ElementCreator({
            tagName: 'span',
            classes: ['error-message'],
            parent: parent,
        });
    }

    private createPasswordElements(parent: HTMLElement): void {
        new ElementCreator<HTMLLabelElement>({
            tagName: 'label',
            classes: ['label', 'label-password'],
            parent: parent,
            textContent: 'Enter your password',
        });
        this.passwordInput = new InputElement(PLACEHOLDER.PASSWORD, 'password', ['input-password'], parent, 'password');
        this.passwordErrorMessage = new ElementCreator({
            tagName: 'span',
            classes: ['error-message'],
            parent: parent,
        });
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
        new Button(BUTTON_NAME.ABOUT, ['button-about-auth'], this.buttonsBox.getElement(), BUTTON_NAME.ABOUT);

        return this.buttonsBox.getElement();
    }

    private setLoginInputListener(): void {
        this.loginInput?.getElement().addEventListener('input', () => {
            if (this.loginInput && this.loginButton) {
                this.cleanErrorMessage(INPUT_TYPE.LOGIN);
                const result = loginHandler(this.loginInput, this.validator);

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
                        event.preventDefault();
                        const login = this.loginInput?.getValue();
                        const password = this.passwordInput?.getValue();
                        if (login && password)
                            handlerBtnLogin(this.isValidLogin, this.isValidPassword, login, password, this.clientApi);
                        break;
                    }
                }
            }
        });
    }

    private setEventListener(): void {
        addEventListener('onLogin', () => {
            const login = this.loginInput?.getValue();
            const password = this.passwordInput?.getValue();
            if (login && password) {
                const userData: User = {
                    login: login,
                    password: password,
                    isLogined: true,
                };
                setData(userData);
                this.router.navigate(PAGES.MAIN);
            }
            this.clientApi.sendRequestToServer(USER_STATUS.INACTIVE, null);
            this.clientApi.sendRequestToServer(USER_STATUS.ACTIVE, null);
        });
    }

    private addLoginBtnEventListener(): void {
        this.formElement?.getElement().addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (this.loginButton && this.loginButton.getElement().classList.contains('disabled')) {
                    return;
                }
                const login = this.loginInput?.getValue();
                const password = this.passwordInput?.getValue();
                if (
                    login?.length !== 0 &&
                    password?.length !== 0 &&
                    !this.loginButton?.getElement().classList.contains('disabled')
                )
                    if (login && password)
                        handlerBtnLogin(this.isValidLogin, this.isValidPassword, login, password, this.clientApi);
            }
        });
    }

    private setErrorMessage(value: string, type: INPUT_TYPE): void {
        if (this.loginErrorMessage && typeof value === 'string') {
            switch (type) {
                case INPUT_TYPE.LOGIN: {
                    this.loginErrorMessage.getElement().textContent = value;
                    break;
                }
                case INPUT_TYPE.PASSWORD: {
                    if (this.passwordErrorMessage) this.passwordErrorMessage.getElement().textContent = value;
                    break;
                }
            }
        }
    }

    private cleanErrorMessage(type: INPUT_TYPE): void {
        switch (type) {
            case INPUT_TYPE.LOGIN: {
                if (this.loginErrorMessage) {
                    this.loginErrorMessage.getElement().textContent = '';
                }
                break;
            }

            case INPUT_TYPE.PASSWORD: {
                if (this.passwordErrorMessage) this.passwordErrorMessage.getElement().textContent = '';
                break;
            }
        }
    }
}
