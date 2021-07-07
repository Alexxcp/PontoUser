import { actionTypes } from '../actions/account.action'

const initialState = {
    user: {
        'name': '',
        'cpf': '',
        'pis': '',
        'address_zipCode': '',
        'address_country': '',
        'address_state': '',
        'address_city': '',
        'address_street': '',
        'address_number': '',
        'address_complement': '',
        'status_register': ''
    },
    userdelete: false,
    error: {}
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case actionTypes.CHANGE:
        return { 
            ...state, 
            user: {
                ...state.user,
                ...payload
            }
        }

    case actionTypes.USERDELETE:
        return {
            ...state,
            userdelete: payload
        }

    case actionTypes.ERROR:
        return {
            ...state,
            error: payload
        }

    default:
        return state
    }
}
