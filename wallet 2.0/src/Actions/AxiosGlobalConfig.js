import React from 'react';
import axios from 'axios';
// import { ROOT_URL } from './types';
let networkType = localStorage.getItem('networkType');
let B_URL = localStorage.getItem('B_URL');
//
// if ( networkType === 'public' ) {
//     console.log('if block', B_URL);
//     axios.defaults.baseURL = 'https://api.sentinelgroup.io';
// } else if ( networkType === 'private' ) {
//     console.log('else block', B_URL);
//     axios.defaults.baseURL = localStorage.getItem('B_URL');
//     axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
//     axios.defaults.headers.common['Cache-Control'] = 'no-cache';
// }


let authTokenRequest;
function getAuthToken() {
    if (!authTokenRequest) {
        let url = localStorage.getItem('B_URL');
        authTokenRequest = axios.post(url + '/client/token', { 'address': url, 'auth_code': localStorage.getItem('authcode') }).then((response) => {
            return response
        }).catch((error) => {
            return error
        });
        authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest).catch(err => { return err })
    }
    return authTokenRequest
}


function resetAuthTokenRequest() {
    authTokenRequest = null
}

axios.interceptors.response.use(async function (response) {
    networkType = await localStorage.getItem('networkType');
    B_URL = await localStorage.getItem('B_URL');
    if (networkType === 'public') {
        localStorage.setItem('B_URL', 'https://api.sentinelgroup.io');
    } else if (networkType === 'private') {
        axios.defaults
        // axios.defaults.baseURL = localStorage.getItem('B_URL');
        // localStorage.setItem('B_URL', B_URL)
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        axios.defaults.headers.common['Cache-Control'] = 'no-cache';
    }
    return response
}, function (error) {

    if (error.response.status === 500) {
        console.log('ServerError globalconfig')
    }

    //expired refresh tokens
    if (error.response.data.description === 'Invalid payload padding') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return
    }

    // xs-token expired

    if (error.response.data.description === 'Signature has expired' && !error.response.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
            return getAuthToken().then((response) => {
                let data = JSON.stringify(response.data);
                data = JSON.parse(data);

                if (response.status === 200) {
                    localStorage.removeItem('access_token');
                    localStorage.setItem('access_token', data.token);
                    error.config.__isRetryRequest = true;
                    error.config.headers.Authorization = 'Bearer ' + data.token;
                    resolve(axios(error.config))
                }
            }).catch((error) => {
                reject(error)
            });
        });
    } else if (error.response.data.status === 'Signature verification failed') {
        localStorage.clear();
    }

    return Promise.reject(error)
});


export const axiosInstance = axios;
