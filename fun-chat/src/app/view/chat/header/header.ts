import { Button } from '../../../components/buttons/buttons';
import { BUTTON_NAME } from '../../../components/buttons/constants';
import { handlerBtnAbout, handlerBtnLogout } from '../../../components/buttons/handlers';
import type { Router } from '../../../services/router/router';
import type { ClientApi } from '../../../services/server-api/client-api';
import { getCurrentUsername } from '../../../services/storage/storage';
import { ElementCreator } from '../../../utils/element-creator';
import type { Options } from '../../../utils/types';
import { ContainerView } from '../../container/container';
import { View } from '../../view';

export class HeaderView extends View {
    private headerWrapper: ElementCreator | null;
    private buttonsBox: HTMLElement | null;
    private router: Router;
    private clientApi: ClientApi;

    constructor(parent: HTMLElement, router: Router, clientApi: ClientApi) {
        const options: Options = {
            tagName: 'header',
            classes: ['header'],
            parent: parent,
        };
        super(options);
        this.router = router;
        this.headerWrapper = null;
        this.buttonsBox = null;
        this.clientApi = clientApi;
        this.configure();
        this.buttonsEventListeners();
    }

    public setUserName(parent: HTMLElement): void {
        const userLogin = getCurrentUsername();
        if (userLogin) {
            const userName = new ElementCreator({
                tagName: 'h3',
                classes: ['user-name'],
                parent: parent,
                textContent: `User: ${userLogin}`,
            });
        }
    }

    private configure(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        this.headerWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['header-wrapper'],
            parent: container.getHTMLElement(),
        });
        this.setTitle(this.headerWrapper.getElement());
        this.setUserName(this.headerWrapper.getElement());
        this.buttonsBox = this.createButtons(this.headerWrapper.getElement());
    }

    private setTitle(parent: HTMLElement): HTMLElement {
        const title = new ElementCreator({
            tagName: 'h1',
            classes: ['title'],
            textContent: 'Fun Chat',
            parent: parent,
        });
        return title.getElement();
    }

    private createButtons(parent: HTMLElement): HTMLElement {
        const buttonsBox = new ElementCreator({
            tagName: 'div',
            classes: ['buttons-box'],
            parent: parent,
        });

        const buttonAbout = new Button(BUTTON_NAME.ABOUT, ['button-about'], buttonsBox.getElement(), BUTTON_NAME.ABOUT);
        const buttonLogout = new Button(
            BUTTON_NAME.LOGOUT,
            ['button-logout'],
            buttonsBox.getElement(),
            BUTTON_NAME.LOGOUT
        );
        return buttonsBox.getElement();
    }

    private buttonsEventListeners(): void {
        this.buttonsBox?.addEventListener('click', (event: MouseEvent) => {
            const targetElement = event?.target;
            if (targetElement instanceof HTMLElement) {
                const action = targetElement.getAttribute('data-action');

                switch (action) {
                    case 'About': {
                        handlerBtnAbout(this.router);
                        break;
                    }
                    case 'Logout': {
                        handlerBtnLogout(this.router, this.clientApi);
                        break;
                    }
                }
            }
        });
    }
}
