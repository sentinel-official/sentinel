import React from 'react';
import axios from 'axios';
import { ROOT_URL } from './types';
axios.defaults.baseURL = ROOT_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
import { Snackbar } from 'material-ui';

let authTokenRequest;
function getAuthToken () {
    if (!authTokenRequest) {
        authTokenRequest = axios.post('/auth/token', {token: localStorage.getItem('refreshToken')}).then((response) => {
            return response
        }).catch((error) => {
            return error
        });
        authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest).catch( err => { return err} )
    }
    return authTokenRequest
}


function resetAuthTokenRequest () {
    authTokenRequest = null
}

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    // const originalRequest = error.config

    if (error.toString() === 'Error: Network Error') {
        <Snackbar open={true} message={"Check Your Internet Connection"} />
    }
    if (error.response.status === 500) {
        console.log('ServerError')
    }

    //expired refresh tokens
    if (error.response.data.message === 'Something wrong with token.') {
        console.log('Refresh Token Expired')
        setTimeout(function () {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/'
        }, 3000);
        return
    }

    // xs-token expired

    if (error.response.data.status === 'unauthenticated' && !error.response.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
            return getAuthToken().then((response) => {
                let data = JSON.stringify(response.data);
                data = JSON.parse(data);

                if (response.status === 200) {
                    localStorage.removeItem('token');
                    localStorage.setItem('token', data.token);
                    error.config.__isRetryRequest = true;
                    error.config.headers.Authorization = 'Bearer ' + data.token;
                    resolve(axios(error.config))
                }
            }).catch((error) => {
                reject(error)
            });
        });
    } else if(error.response.data.status === 'unauthenticated') {
        localStorage.clear();
        window.location.href='/';
    }

    return Promise.reject(error)
});


export const axiosInstance = axios;
