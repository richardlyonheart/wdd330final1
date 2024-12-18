import { createElement } from './utils';
const helloNode = createElement('h1',{textContent: 'hello world'});

import App from './App';

document.getElementById('root').appendChild(helloNode);

