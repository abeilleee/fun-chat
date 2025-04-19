import type { WebSocketConnection } from '../../services/web-socket-connection/web-socket-connection';
import { ElementCreator } from '../../utils/element-creator';
import { MODAL_TEXT } from './constants';

export class ConnectionWaiter {
    private websocket: WebSocketConnection;
    private modalWrapper: HTMLElement | null | HTMLDialogElement;
    // private checkInterval: number;
    // private timeout: number;

    constructor(websocket: WebSocketConnection) {
        this.websocket = websocket;
        this.modalWrapper = null;
    }

    public showWaiter(): void {
        this.createComponent();
        document.body.style.overflow = 'hidden';
    }

    public hideWaiter(): void {
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
