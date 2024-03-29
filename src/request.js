import axios from 'axios'
// import {useUserInfoStore} from '@/store'

const baseURL = process.env.NODE_ENV === 'production'?('/'):'/api/'
export const BASE_URL = baseURL;

const instance = axios.create({
    baseURL:BASE_URL
});

instance.interceptors.request.use(function (config) {
    // useUserInfoStore().token && (config.headers.Sessionid = useUserInfoStore().token)
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    if(response.data.zt == 0){
        setTimeout(()=>{
            // showToast(response.data.msg)
        },100)
    }
    // if(response.data.zt == -2){
    //     document.body.innerHTML = '非法请求'
    // }
    return response.data
}, function (error) {
    switch(error.response.status){
        case 401:
            // useUserInfoStore().logout()
            // showToast('登录过期')
            break;
        case 500:
            // showToast('服务器错误')
            break;
        default:
            // showToast('网络错误')
    }

    return
    // return Promise.reject(error);
});

export default instance