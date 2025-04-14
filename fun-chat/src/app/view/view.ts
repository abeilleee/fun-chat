import { Options } from '../utils/types';
import { ElementCreator } from '../utils/element-creator';

export class View {
    element: ElementCreator;

    constructor(options: Options) {
        this.element = this.createView(options);
    }

    public getHTMLElement(): HTMLElement {
        return this.element.getElement();
    }

    private createView(options: Options): ElementCreator {
        const element = new ElementCreator(options);
        return element;
    }

    public addInnerElements(elements: HTMLElement[]): void {
        elements.forEach((child: HTMLElement) => this.element.getElement().append(child));
    }
}
