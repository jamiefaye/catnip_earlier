import React from 'react';
import ReactDOM from 'react-dom';
//import $ from'jquery';
import './index.css';
import './goldenlayout-base.css';
import './goldenlayout-light-theme.css';
import GoldenLayout from 'golden-layout';
import {DirPage} from "./dirpage/DirPage.jsx";
import {Xpj} from "./xpj/Xpj.jsx";
import {ButtonRow} from './waverly/src/ButtonRow.jsx';

import * as serviceWorker from './serviceWorker';

// Suggested by azotklas in: https://github.com/golden-layout/golden-layout/issues/449

window.React = React;
window.ReactDOM = ReactDOM;

//ReactDOM.render(<DirPage />, document.getElementById('root'));

var myLayout = new GoldenLayout({
    content: [{
        type: 'row',
        content:[{
            type:'react-component',
            component: 'DirPage',
            props: { label: 'DirPage' }
        },{
            type: 'column',
            content:[{
                type:'react-component',
                component: 'ButtonRow',
                props: { label: 'Xpj' }
            }]
        }]
    }]
});

myLayout.registerComponent('DirPage', DirPage);
myLayout.registerComponent('Xpj', Xpj);
myLayout.registerComponent('ButtonRow', ButtonRow);

myLayout.init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
