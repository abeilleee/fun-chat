import { ElementCreator } from '../../utils/element-creator';

export class Background {
    private bg: ElementCreator;
    private bgImg: HTMLElement | HTMLImageElement;

    constructor() {
        this.bg = new ElementCreator({ tagName: 'div', classes: ['bg'], parent: document.body });
        this.bgImg = new ElementCreator<HTMLImageElement>({
            tagName: 'img',
            classes: ['bg-img'],
            parent: this.bg.getElement(),
        }).getElement();

        if (this.bgImg instanceof HTMLImageElement) {
            this.bgImg.src = './assets/images/bg.webp';
        }
    }

    public getHTMLElement(): HTMLElement {
        return this.bg.getElement();
    }
}
