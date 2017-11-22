import { createStore, applyMiddleware } from 'redux';
import app from './reducers';
import thunk from 'react-thunk';

export default function configureStore() {
	let store = createStore(app, applyMiddleware(thunk));
	return store;
}