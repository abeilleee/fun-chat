import type { Options } from '../../../../utils/types';
import { View } from '../../../view';

export class MessageField extends View {
    constructor(parent: HTMLElement) {
        const options: Options = {
            tagName: 'div',
            classes: ['message-field'],
            parent: parent,
        };
        super(options);
    }
}
