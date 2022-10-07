import axios from 'axios'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants'


export const login = (email, password) => async (dispatch) => {
    try{

        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        let config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        let {data} = await axios.post(
                '/api/user/token/',
                {
                    'email': email,
                    'password': password,
                },
                config,
            );

        config = {
            headers: {
                'Authorization': `Token ${data.token}`
            }
        }

        const user = await axios.get(
            '/api/user/me/',
            config,
        )

        data = {...data, ...user.data}

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    }catch(error){
        dispatch({
            type    : USER_LOGIN_FAIL,
            payload : error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,

        });
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
}

export const register = (name, email, password) => async (dispatch) => {
    try{
        dispatch({
            type: USER_REGISTER_REQUEST,
        });
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        let {data} = await axios.post(
                '/api/user/create/',
                {
                    'name': name,
                    'email': email,
                    'password': password,
                },
                config,
            );

        const token = await axios.post(
            '/api/user/token/',
            {
                'email': email,
                'password': password,
            },
            config,
        );

        data = {...data, 'token': token.data.token}

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data));

    }catch(error){

        dispatch({
            type : USER_REGISTER_FAIL,
            payload : error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,

        })
    }
}
