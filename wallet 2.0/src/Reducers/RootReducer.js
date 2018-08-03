import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';

const rootReducer = combineReducers({
    setLanguage: setLanguage,
    createAccount: createAccount,
    setComponent: setComponent,
    isTest: true
});

export default rootReducer;