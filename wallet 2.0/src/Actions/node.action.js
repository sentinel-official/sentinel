import * as types from './../Constants/action.names';

export function setDockerImages(data) {
    return {
        type: types.DOCKER_IMAGES,
        payload: data
    }
}

export function setDockerContainers(data) {
    return {
        type: types.DOCKER_CONTAINERS,
        payload: data
    }
} 
export function setImageClients(data) {
    return {
        type: types.IMAGE_CLIENTS,
        payload: data
    }
}
export function isConnected(data){
    return {
        type: types.CONNECT_STATUS,
        payload: data
    }
}
export function logoutNode(data){
        return{
            type: types.LOGOUT_NODE,
            payload: data
        }
    }
