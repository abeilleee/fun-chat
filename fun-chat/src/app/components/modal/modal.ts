import { ElementCreator } from '../../utils/element-creator';
import { Button } from '../buttons/buttons';
import { BUTTON_NAME } from '../buttons/constants';

export class Modal {
    private modalWrapper: HTMLElement | null | HTMLDialogElement;
    private closeBtn: Button | null;

    constructor() {
        this.modalWrapper = null;
        this.closeBtn = null;
        this.setCloseBtnEventListener();
    }

    public showModal(text: string): void {
        this.createModal(text);
        document.body.style.overflow = 'hidden';
        this.setCloseBtnEventListener();
    }

    public closeModal(): void {
        if (this.modalWrapper) {
            this.modalWrapper.remove();
            document.body.style.overflow = '';
        }
    }

    private createModal(text: string): void {
        this.modalWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['modal-wrapper'],
            parent: document.body,
        }).getElement();
        const modal = new ElementCreator({
            tagName: 'div',
            classes: ['modal'],
            parent: this.modalWrapper,
            textContent: text,
        });
        this.closeBtn = new Button(BUTTON_NAME.CLOSE, ['button-close'], modal.getElement());
    }

    private setCloseBtnEventListener(): void {
        this.closeBtn?.getElement().addEventListener('click', () => {
            this.closeModal();
        });
    }
}
