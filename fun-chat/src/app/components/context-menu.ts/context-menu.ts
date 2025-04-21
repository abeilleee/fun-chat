import { ElementCreator } from '../../utils/element-creator';
import { Button } from '../buttons/buttons';
import { BUTTON_NAME } from '../buttons/constants';
import { CONTEXT_MENU_WIDTH } from './constants';

export class ContextMenu {
    public isOpen = false;
    private menu: ElementCreator | null;
    private btnDelete: ElementCreator | null;
    private btnEdit: ElementCreator | null;

    constructor() {
        this.menu = null;
        this.btnDelete = null;
        this.btnEdit = null;
        this.setEventListeners();
    }

    public setEventListeners(): void {
        this.btnDelete?.getElement().addEventListener('click', () => {
            this.closeMenu();
        });
        this.btnEdit?.getElement().addEventListener('click', () => {
            this.closeMenu();
        });
    }

    public showMenu(clientX: number, clientY: number): void {
        this.menu = new ElementCreator({ tagName: 'div', classes: ['context-menu'], parent: document.body });
        this.btnDelete = new Button(BUTTON_NAME.DELETE, ['button-delete'], this.menu.getElement());
        this.btnEdit = new Button(BUTTON_NAME.EDIT, ['button-edit'], this.menu.getElement());
        const offsetX = clientX - CONTEXT_MENU_WIDTH;
        this.menu.getElement().style.left = `${offsetX}px`;
        this.menu.getElement().style.top = `${clientY}px`;
        this.isOpen = true;
    }

    public closeMenu(): void {
        if (this.menu) {
            this.menu.getElement().remove();
        }
        this.isOpen = false;
    }
}
