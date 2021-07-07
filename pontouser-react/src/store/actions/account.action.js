import { Http, HttpAuth } from '../../config/Http'
import { changeLoading } from './loading.action'
import { changeNotify } from './notify.action'

export const actionTypes = {
    CHANGE: 'ACCOUNT_CHANGE',
    ERROR: 'ACCOUNT_ERROR',
    USERDELETE: 'ACCOUNT_USERDELETE'
}


export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const errors = (payload) => ({
    type: actionTypes.ERROR,
    payload
})

export const userdelete = (payload) => ({
    type: actionTypes.USERDELETE,
    payload
})

export const index = () => dispatch => {
    return HttpAuth.get('get_user')
        .then(res => {
            if (res !== undefined) {
                if (res.data.status === 200) {
                    dispatch(change(res.data.user))
                    return true
                }
            }
        });
}

export const cep = (zipCode) => dispatch => {
    if (zipCode.length > 8) {
        return Http.post('webservice/cep', {
            cep: zipCode
        })
            .then(res => typeof res !== 'undefined' && dispatch(change(res.data)));
    }
}

export const update = data => dispatch => {
    data.cpf = data.cpf ? data.cpf.replace(/[^0-9]/g, '') : '';
    data.pis = data.pis ? data.pis.replace(/[^0-9]/g, '') : '';
    dispatch(changeLoading({
        open: true,
        msg: 'Atualizando cadastro...'
    }));

    return HttpAuth.put('/edit_user', data)
        .then(res => {
            dispatch(changeLoading({ open: false }))
            if (res.data.status === 200) {
                dispatch(changeNotify({
                    open: true,
                    class: 'success',
                    msg: 'Cadastro atualizado com sucesso.'
                }))
            } else {
                dispatch(changeLoading({ open: false }))

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


export const deleteUser = data => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Excluindo conta...'
    }));

    return HttpAuth.delete('/delete_user', data)
        .then(res => {
            dispatch(changeLoading({ open: false }))
            if (res.data.status === 200) {
                    dispatch(changeNotify({
                        open: true,
                        class: 'success',
                        msg: 'Conta excluída com sucesso.'
                    }))
                    localStorage.removeItem('remember');
                    localStorage.removeItem('login');
                    localStorage.removeItem('password');
                    localStorage.removeItem('token');
                dispatch(userdelete(true))
            } else {
                dispatch(changeLoading({ open: false }))
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