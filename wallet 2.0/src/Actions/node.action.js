import * as types from './../Constants/action.names';


let NM = require('../NM-Tools/nm');
var nm = new NM()



export async function connectToNodeDocker(ip, uid, pwd) {
    return dispatch => {
        nm.connect(ip, uid, pwd, (cb) => {
            if (cb) {
                dispatch({
                    type: types.NM_CONNECT_ERR,
                    payload: 'Error'
                })
            }
            else {
                dispatch({
                    type: types.NM_CONNECT_SUCCESS,
                    payload: true
                })
                dispatch({
                    type: types.CONNECT_STATUS,
                    payload: true
                })
            }
        })
    }

}


export function connectToNM(ip, uid, pwd, cb) {
    nm.connect(ip, uid, pwd, (res) => {
        if (res) {
            cb(res)
        }
        else {
            cb(null)
        }
    })
}
export function setDockerImages() {

    return dispatch => {
        let data = null;
        let parsedData = null;
        nm.listDockerImages((err, stderr, stdout) => {

            if (stdout) {
                data = stdout;
                if (data) {
                    parsedData = JSON.parse('[' + data.trim().split('\n').join(',') + ']')

                }
                if (parsedData) {
                    dispatch({
                        type: types.DOCKER_IMAGES,
                        payload: parsedData
                    })
                }
            }
            if (stderr) {
                dispatch({
                    type: types.DOCKER_IMAGES_ERR,
                    payload: false
                })
            }
        }
        )
    }


}

export function setDockerContainers(data) {
    return dispatch => {
        let data = null;
        let parsedData = null;
        let clients = [];
        let go = false;
        nm.listDockerContainers((err, stderr, stdout) => {
            if (stdout) {
                data = stdout;
                if (data) {
                    parsedData = JSON.parse('[' + data.trim().split('\n').join(',') + ']')
                }
                if (parsedData) {
                    parsedData.map((item, i, arr) => {
                        nm.numberOfClients(item.Names, (err, stderr, stdout) => {
                            // console.log("index starting ",i)
                            // if(err){ 
                            //     console.log("index ", i, "normal err ", err)
                            // }
                            if (i === arr.length - 1) {
                                go = true;
                            }
                            if (stdout) {
                                //    console.log("client ind ", i , stdout)
                                clients[i] = stdout.trim();


                            }
                            else {
                                clients[i] = "0";

                            }
                            if (!clients.includes(undefined) && go === true) {
                                dispatch({
                                    type: types.IMAGE_CLIENTS,
                                    payload: clients
                                })
                                dispatch({
                                    type: types.DOCKER_CONTAINERS,
                                    payload: parsedData
                                })

                            }
                            // if(stderr){
                            //     console.log("std err ", stderr)

                            // }       
                        }
                        )

                    })

                }
            }
        }
        )
    }

}
export function setImageClients(data) {
    return {
        type: types.IMAGE_CLIENTS,
        payload: data
    }
}
export function isConnected(data) {
    return {
        type: types.CONNECT_STATUS,
        payload: data
    }
}
export function logoutNode() {
    return dispatch => {
        try {
            let v = nm.sshManager.end();
            if (v === false) {
                dispatch({
                    type: types.LOGOUT_NODE,
                    payload: true
                })
                dispatch({
                    type: types.CONNECT_STATUS,
                    payload: false
                })
            }
        } catch (err) {
        }
    }
}
