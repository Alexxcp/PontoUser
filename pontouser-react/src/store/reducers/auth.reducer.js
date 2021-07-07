import { actionTypes } from '../actions/auth.action'

const initialState = {
    credentials: {
        login: '',
        password: '',
        remember: false
    },
    success: false,
    socialiteRedirect: '',
    socialiteDispat: true
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case actionTypes.CHANGE:
            return {
                ...state,
                credentials: {
                    ...state.credentials,
                    ...payload
                }
            }

        case actionTypes.SUCCESS:
            return {
                ...state,
                success: payload
            }

        case actionTypes.SOCIALITE:
            return {
                ...state,
                socialiteRedirect: payload
            }

        case actionTypes.SOCIALITEDISPAT:
            return {
                ...state,
                socialiteDispat: payload
            }

        default:
            return state
    }
}
