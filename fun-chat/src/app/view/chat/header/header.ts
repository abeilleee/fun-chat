import { Button } from '../../../components/buttons/buttons';
import { BUTTON_NAME } from '../../../components/buttons/constants';
import { ElementCreator } from '../../../utils/element-creator';
import type { Options } from '../../../utils/types';
import { ContainerView } from '../../container/container';
import { View } from '../../view';

export class HeaderView extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'header',
            classes: ['header'],
            parent: parent,
        };
        super(options);
        this.configure();
    }

    public setUserName(parent: HTMLElement, id: number): HTMLElement {
        const userName = new ElementCreator({
            tagName: 'h3',
            classes: ['user-name'],
            parent: parent,
            textContent: `User: ${id}`,
        });
        return userName.getElement();
    }

    private configure(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        const headerWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['header-wrapper'],
            parent: container.getHTMLElement(),
        });
        this.setTitle(headerWrapper.getElement());
        this.createButtons(headerWrapper.getElement());
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

        const buttonAbout = new Button(BUTTON_NAME.ABOUT, ['button-about'], buttonsBox.getElement());
        const buttonLogout = new Button(BUTTON_NAME.LOGOUT, ['button-logout'], buttonsBox.getElement());
        return buttonsBox.getElement();
    }
}
