import React from 'react';
import axios from 'axios'

var CryptoJS = require("crypto-js");
const MKV = 'L#2Qe2vQNs$)Rdl*Cd(!';

const AxiosInterceptor = ({ ...props }) => {
    var isDebug = false
    if (isDebug) console.log('Here In Interceptor ')
    // axios.defaults.headers.post['Content-Type'] = 'application/json';
    // axios.defaults.headers.post['Accept'] = 'application/json';
    // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    var SERVICE_URL = "";


    // if (window.location.hostname == "ff.sindhpolice.gov.pk")
    //     SERVICE_URL = "http://ffapi.sindhpolice.gov.pk/api/"

    // if (window.location.hostname == "192.168.254.189")
    //     SERVICE_URL = "http://192.168.254.189:3210/api/"

    // if (SERVICE_URL.length < 1) {
    // SERVICE_URL = 'http://localhost:3001/api'
    // SERVICE_URL = Constants.API_URL;


    // SERVICE_URL = window.location.origin + '/api/';
    SERVICE_URL = 'http://3.21.230.123:3008' + '/api/';
    http://localhost:3008
    // }

    // SERVICE_URL = 'http://localhost:3008' + '/api/';

    axios.defaults.baseURL = SERVICE_URL;
    // axios.defaults.baseURL = 'http://localhost:8000/api';

    axios.interceptors.request.use((config) => {
        var iTem = localStorage.getItem('cypress_user_1001');
        var bytes = iTem ? CryptoJS.AES.decrypt(iTem, MKV).toString(CryptoJS.enc.Utf8) : null;
        var authUser = bytes ? JSON.parse(bytes) : null;

        if (isDebug) console.log('here')
        if (authUser) {
            if (isDebug) console.log('here 1')
            var token = authUser && authUser.accessToken ? `Bearer ${authUser.accessToken}` : 'Bearer ';
            if (token.length > 0) {
                if (isDebug) console.log('here 2')
                config.headers.Authorization = token;
            }
            return config;
        } else {
            if (isDebug) console.log('here 3')
            return config;
        }
    }, (error) => {
        if (isDebug) console.log('here 4')
        return Promise.reject(error);
    });

    return (
        <div></div>
    )
}

export default AxiosInterceptor;