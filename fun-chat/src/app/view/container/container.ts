import { View } from '../view';
import type { Options } from '../../utils/types';

export class ContainerView extends View {
    constructor(className: string[], parent?: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['container', ...className],
            parent: parent,
        };

        super(options);
    }
}
