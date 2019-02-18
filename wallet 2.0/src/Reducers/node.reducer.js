import * as types from "../Constants/action.names";


export function getDockerImages( state = null , action){
    switch (action.type){
        case types.DOCKER_IMAGES:
            return action.payload;
            case types.DOCKER_IMAGES_ERR:
            return action.payload;
        default:
        return state;
    }

}
export function getDockerContainers( state = null , action){
    switch (action.type){
        case types.DOCKER_CONTAINERS:
            return action.payload;
        default:
        return state;
    }

}
export function getImagesClients( state = null , action){
    switch (action.type){
        case types.IMAGE_CLIENTS:
            return action.payload;
        default:
        return state;
    }

}
export function isLoggedOutNode (state = null , action){
    switch (action.type){
        case types.LOGOUT_NODE:
            return action.payload;
        default:
        return state;
    }
}

export function connectionStatus (state = false, action){
    switch (action.type){
        case types.CONNECT_STATUS:
          {  
              return action.payload;
              
        }
        default:
        return state;
    }
}
export function isNMConnected ( state = false, action){
    switch (action.type){
     
        case types.NM_CONNECT_ERR:
          {  
              return action.payload;
              
        }
        case types.NM_CONNECT_SUCCESS:
        {  
            return action.payload;
            
      }
        default:
        return state;
    }
}


