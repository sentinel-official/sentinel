import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import { Provider } from 'react-redux';
import { B_URL } from './Constants/constants';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import rootreducer from './Reducers/RootReducer';


axios.defaults.baseURL = B_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);
ReactDOM.render(
    <Provider store={createStoreWithMiddleware(rootreducer)}>
        <App />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
