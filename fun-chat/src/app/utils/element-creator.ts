import { Options } from './types';

export class ElementCreator<T extends HTMLElement = HTMLElement> {
    public element: T | HTMLElement;

    constructor(options: Options) {
        this.element = this.createElement(options);
    }

    public getElement(): T | HTMLElement {
        return this.element;
    }

    public createElement(options: Options): T | HTMLElement {
        const element = document.createElement(options.tagName);
        this.setClasses(options, element);
        this.setTextContent(options, element);
        this.setParentElement(options, element);
        this.addInnerElement(options, element);
        return element;
    }

    private setClasses(options: Options, element: T | HTMLElement): void {
        options.classes.forEach((className: string) => element.classList.add(className));
    }

    private setTextContent(options: Options, element: T | HTMLElement): void {
        if (options.textContent) {
            element.textContent = options.textContent;
        }
    }

    private setParentElement(options: Options, element: T | HTMLElement): void {
        if (options.parent) {
            options.parent.append(element);
        }
    }

    public addInnerElement(options: Options, element: T | HTMLElement): void {
        if (options.children) {
            options.children.forEach((child) => {
                element.append(child);
            });
        }
    }
}
