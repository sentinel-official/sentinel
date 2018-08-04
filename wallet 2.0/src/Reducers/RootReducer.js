import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { getFreeAmount } from './receive.reducer';
const rootReducer = combineReducers({
    setLanguage: setLanguage,
    createAccount: createAccount,
    setComponent: setComponent,
    isTest: true,
    getFreeAmount: getFreeAmount
});

export default rootReducer;