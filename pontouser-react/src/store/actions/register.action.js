import { Http } from '../../config/Http'
import { changeLoading } from './loading.action'
import { changeNotify } from './notify.action'

export const actionTypes = {
    CHANGE: 'REGISTER_CHANGE',
    ERROR: 'REGISTER_ERROR',
    SUCCESS: 'REGISTER_SUCCESS'
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const errors = (payload) => ({
    type: actionTypes.ERROR,
    payload
})

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

export const cep = (zipCode) => dispatch => {
    if (zipCode.length > 8) {
        return Http.post('webservice/cep', {
            cep: zipCode
        })
            .then(res => typeof res !== 'undefined' && dispatch(change(res.data)));
    }
}

export const setUserToken = token => dispatch => {
    localStorage.setItem('token', token);
    dispatch(change({
        name: '',
        email: '',
        password: ''
    }))

    dispatch(success(true))
}

export const setSuccess = () => dispatch => {
    dispatch(success(false))
}

export const register = data => dispatch => {
    data.cpf = data.cpf ? data.cpf.replace(/[^0-9]/g, '') : '';
    data.pis = data.pis ? data.pis.replace(/[^0-9]/g, '') : '';
    dispatch(changeLoading({
        open: true,
        msg: 'Cadastrando usuário...'
    }));

    return Http.post('/register', data)
        .then(res => {
            dispatch(changeLoading({ open: false }))
            if (res.data.status === 200) {
                if (res.data.token) {
                    dispatch(changeNotify({
                        open: true,
                        class: 'success',
                        msg: 'Usuário cadastrado com sucesso.'
                    }))

                    dispatch(setUserToken(res.data.token))
                }
            } else {
                dispatch(changeLoading({ open: false }))
                dispatch(success(null))

                if (res.data.error) {
                    dispatch(errors(res.data.error))
                }
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