import type { Options } from '../utils/types';
import { ElementCreator } from '../utils/element-creator';

export class View {
    private element: ElementCreator;

    constructor(options: Options) {
        this.element = this.createView(options);
    }

    public getHTMLElement(): HTMLElement {
        return this.element.getElement();
    }

    public addInnerElements(elements: HTMLElement[]): void {
        elements.forEach((child: HTMLElement) => this.element.getElement().append(child));
    }

    private createView(options: Options): ElementCreator {
        const element = new ElementCreator(options);
        return element;
    }
}
