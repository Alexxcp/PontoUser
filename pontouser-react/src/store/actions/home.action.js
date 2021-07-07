import { HttpAuth } from '../../config/Http'

export const index = () => dispatch => {

    return HttpAuth.get('get_user')
        .then(res => {
            if (res !== undefined) {
                if (res.data.status === 200) {
                    return res.data.user;
                } else if (res.data.error) {
                    return res.data.error;
                }
            }
        });

}