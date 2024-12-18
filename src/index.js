const helloworld = document.createElement('h1');
helloworld.textContent = "hello world, weather stuff";
document.getElementById('root').appendChild(helloworld);

import App from './App';

document.getElementById('root').appendChild(App());

