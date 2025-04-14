import type { Options } from '../../utils/types';
import { View } from '../view';

export class HeaderView extends View {
    constructor() {
        const options: Options = {
            tagName: 'header',
            classes: ['header'],
        };
        super(options);
    }
}
