import type { Options } from '../utils/types';
import { View } from './view';

export class MainView extends View {
    constructor() {
        const options: Options = {
            tagName: 'main',
            classes: ['main'],
        };
        super(options);
    }

    public setContent(): void {
        const htmlElement = this.element.getElement();
        while (htmlElement.firstElementChild) {
            htmlElement.firstElementChild.remove();
        }
    }
}
