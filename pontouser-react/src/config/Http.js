import Axios from 'axios'
import { apiUrl } from './App'

export const Http = Axios.create({
    baseURL: apiUrl
})

export const HttpAuth = Axios.create({
    baseURL: apiUrl
})

HttpAuth.defaults.params = {};
HttpAuth.interceptors.request.use(
    async (config) => {
        config.params['token'] = await localStorage.getItem('token')
        return config;
    }
)

HttpAuth.interceptors.response.use(res => {
    if(res.status) {
        if(res.data.status === 401) {
            localStorage.removeItem('token');
            window.location.replace('/login')
        }
    }
    return res;
}, error => {
    if(error.response) {
        if(error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.replace('/login')
        }
    }
})


