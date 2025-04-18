import type { Options } from '../utils/types';
import { ElementCreator } from '../utils/element-creator';

export class View {
    protected element: ElementCreator;

    constructor(options: Options) {
        this.element = this.createView(options);
    }

    public getHTMLElement(): HTMLElement {
        return this.element.getElement();
    }

    public addInnerElements(elements: HTMLElement[]): void {
        elements.forEach((child: HTMLElement) => this.element.getElement().append(child));
    }

    public removeChildren(): void {
        const HTMLElement = this.getHTMLElement();
        while (HTMLElement.firstChild) {
            HTMLElement.removeChild(HTMLElement.firstChild);
        }
    }

    private createView(options: Options): ElementCreator {
        const element = new ElementCreator(options);
        return element;
    }
}
