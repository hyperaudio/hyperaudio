import React from 'react';
import ReactDOM from 'react-dom';

import Player from './Player';
// import TranscriptPlayer from './TranscriptPlayer';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Player />, document.getElementById('root'));
// ReactDOM.render(<TranscriptPlayer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
