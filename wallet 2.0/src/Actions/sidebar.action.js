import * as types from './../Constants/action.names';

export function setCurrentTab(component) {
    return {
        type: types.CURRENT_TAB,
        payload: component
    }
}