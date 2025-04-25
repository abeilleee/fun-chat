import { ElementCreator } from '../../utils/element-creator';
import { MODAL_TEXT } from './constants';

export class ConnectionWaiter {
    public isOpen: boolean = false;
    private modalWrapper: HTMLElement | null | HTMLDialogElement;

    constructor() {
        this.modalWrapper = null;
    }

    public showWaiter(): void {
        this.isOpen = true;
        this.createComponent();
        document.body.style.overflow = 'hidden';
    }

    public hideWaiter(): void {
        this.isOpen = false;
        if (this.modalWrapper) {
            this.modalWrapper.remove();
            document.body.style.overflow = '';
        }
    }

    private createComponent(): void {
        this.modalWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['modal-wrapper'],
            parent: document.body,
        }).getElement();
        const modal = new ElementCreator({
            tagName: 'div',
            classes: ['modal'],
            parent: this.modalWrapper,
            textContent: MODAL_TEXT,
        });
    }
}
