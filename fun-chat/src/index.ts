import './styles.scss';
require.context('./assets/images', true);

import { App } from './app/app';

const app = new App();
