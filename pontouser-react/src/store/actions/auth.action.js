import { Http, HttpAuth } from '../../config/Http'
import { changeLoading } from './loading.action'
import { changeNotify } from './notify.action'

export const actionTypes = {
    CHANGE: 'AUTH_CHANGE',
    SUCCESS: 'AUTH_SUCCESS',
    SOCIALITE: 'AUTH_SOCIALITE',
    SOCIALITEDISPAT: 'AUTH_SOCIALITEDISPAT'
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const socialiteRedirect = (payload) => ({
    type: actionTypes.SOCIALITE,
    payload
})

export const socialiteDispat = (payload) => ({
    type: actionTypes.SOCIALITEDISPAT,
    payload
})

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

export const _index = () => dispatch => {

    var remember = localStorage.getItem('remember')

    if (remember) {
        var login = localStorage.getItem('login')
        var password = localStorage.getItem('password')

        if (login !== null && password !== null) {
            dispatch(change({
                login: login,
                password: password,
                remember: remember,
            }))
            dispatch(autoLogin(login, password))
        }
    }
}

export const autoLogin = (login, password) => dispatch => {

    dispatch(changeLoading({
        open: true,
        msg: 'Autenticando usuário...'
    }))

    return Http.post('login', {
        login: login,
        password: password
    })
        .then(res => {
            dispatch(changeLoading({ open: false }));
            if (res.data.status === 200) {
                if (res.data.token) {
                    dispatch(setUserToken(res.data.token));
                }
            } else {
                dispatch(changeLoading({ open: false }));
                var message = res.data.error.email ? res.data.error.email : res.data.error.cpf;
                message = message ? message : res.data.error;
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: message
                }))
            }
        })
        .catch(error => {
            dispatch(changeLoading({ open: false }));
            dispatch(changeNotify({
                open: true,
                class: 'error',
                msg: 'Erro ao se conectar ao servidor'
            }))
        })

}

export const setUserToken = token => dispatch => {
    localStorage.setItem('token', token);
    dispatch(change({
        login: '',
        password: ''
    }))

    dispatch(success(true))
}

export const logout = () => dispatch => {

    return HttpAuth.get('logout')
        .then(res => {
            if (res.data.status === 200) {
                localStorage.removeItem('remember');
                localStorage.removeItem('login');
                localStorage.removeItem('password');
                localStorage.removeItem('token');
                dispatch(change({
                    login: '',
                    password: '',
                    remember: false
                }))
                return true;
            } else {
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Erro tentar fazer logout'
                }))
            }
        })
        .catch(error => {
            dispatch(changeNotify({
                open: true,
                class: 'error',
                msg: 'Erro ao se conectar ao servidor'
            }))
        })
}



export const login = credentials => dispatch => {

    if (credentials.socialite) {

        dispatch(socialiteDispat(false))

        dispatch(changeLoading({
            open: true,
            msg: 'Autenticando usuário...'
        }))

        return Http.post('login/github', {
            code: credentials.socialite
        })
            .then(res => {
                dispatch(changeLoading({ open: false }));
                if (res.data.status === 200) {
                    if (res.data.token) {
                        dispatch(setUserToken(res.data.token));
                    }
                } else {
                    dispatch(changeLoading({ open: false }));
                    dispatch(changeNotify({
                        open: true,
                        class: 'error',
                        msg: 'Erro ao tentar efetuar login por GitHub'
                    }))
                }
            })
            .catch(error => {
                dispatch(changeLoading({ open: false }));
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Erro ao se conectar ao servidor'
                }))
            })

    } else if (credentials.login !== '' && credentials.password !== '') {

        dispatch(changeLoading({
            open: true,
            msg: 'Autenticando usuário...'
        }))

        return Http.post('login', {
            login: credentials.login,
            password: credentials.password
        })
            .then(res => {
                dispatch(changeLoading({ open: false }));
                if (res.data.status === 200) {
                    if (res.data.token) {
                        dispatch(setUserToken(res.data.token));
                        if (credentials.remember) {
                            localStorage.setItem('login', credentials.login);
                            localStorage.setItem('password', credentials.password);
                            localStorage.setItem('remember', credentials.remember);
                        }
                    }
                } else {
                    dispatch(changeLoading({ open: false }));
                    var message = res.data.error.email ? res.data.error.email : res.data.error.cpf;
                    message = message ? message : res.data.error;
                    dispatch(changeNotify({
                        open: true,
                        class: 'error',
                        msg: message
                    }))
                }
            })
            .catch(error => {
                dispatch(changeLoading({ open: false }));
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Erro ao se conectar ao servidor'
                }))
            })
    } else {
        dispatch(changeNotify({
            open: true,
            class: 'error',
            msg: 'Para efetuar o login preencha o acesso e senha'
        }))
    }
}

export const socialite = credentials => dispatch => {


    dispatch(changeLoading({
        open: true,
        msg: 'Redirecionando...'
    }))

    return Http.post('login/github/url', {
        login: credentials.login,
        password: credentials.password
    })
        .then(res => {
            dispatch(changeLoading({ open: false }));
            if (res.data.status === 200) {
                if (res.data.url) {
                    dispatch(socialiteRedirect(res.data.url))
                }
            } else {

                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Erro ao tentar redirecionar para rede social'
                }))
            }
        })
        .catch(error => {
            dispatch(changeLoading({ open: false }));
            dispatch(changeNotify({
                open: true,
                class: 'error',
                msg: 'Erro ao se conectar ao servidor'
            }))
        })
}





