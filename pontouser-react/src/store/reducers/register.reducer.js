import { actionTypes } from '../actions/register.action'

const initialState = {
    user: {
        'name': '',
        'email': '',
        'cpf': '',
        'pis': '',
        'address_zipCode': '',
        'address_country': '',
        'address_state': '',
        'address_city': '',
        'address_street': '',
        'address_number': '',
        'address_complement': '',
        'password': ''
    },
    success: false,
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

    case actionTypes.SUCCESS:
        return {
            ...state,
            success: payload
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
