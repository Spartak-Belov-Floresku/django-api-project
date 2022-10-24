import axios from 'axios'
import Cookies from 'js-cookie'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,

    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,

} from '../constants/userConstants'

const getToken = (email, password, config) => {
    return axios.post(
        `/api/user/token/`,
        {
            'email': email,
            'password': password,
        },
        config,
    )
}

const getUserData = (config) => {
    return axios.get(
        `/api/user/me/`,
        config,
    )
}

export const login = (email, password) => async (dispatch) => {
    try{

        dispatch({
            type: USER_LOGIN_REQUEST,
        })
        
        let config = {
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        let {data} = await getToken( email, password, config)

        config = {
            headers: {
                'Authorization': `Token ${data.token}`
            }
        }

        const user = await getUserData(config)

        data = {...data, ...user.data}

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    }catch(error){
        dispatch({
            type    : USER_LOGIN_FAIL,
            payload : error.response && error.response.data.non_field_errors[0]
                        ? error.response.data.non_field_errors[0]
                        : error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
    dispatch({type: USER_DETAILS_RESET})
}

export const register = (name, email, password) => async (dispatch) => {
    try{

        dispatch({
            type: USER_REGISTER_REQUEST,
        })

        const config = {
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        let {data} = await axios.post(
                `/api/user/create/`,
                {
                    'name': name,
                    'email': email,
                    'password': password,
                },
                config,
            );

        const token = await getToken( email, password, config)

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
            payload : error.response && error.response.data.email
                        ? error.response.data.email
                        : error.message,

        })
    }
}

export const getUserDetails = () => async (dispatch, getState) => {
    try{
        dispatch({
            type: USER_DETAILS_REQUEST,
        })

        const {
            userLogedIn:{ userInfo }
        } = getState()

        const config = {
            headers: {
                'Authorization': `Token ${userInfo.token}`
            }
        }
        
        const {data} = await getUserData(config)
        
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        })

    }catch(error){
        dispatch({
            type    : USER_DETAILS_FAIL,
            payload : error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,

        })
    }
}

export const updateUserProfile = user => async (dispatch, getState) => {
    try{
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        })

        const {userLogedIn:{userInfo}} = getState()

        const config = {
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Authorization': `Token ${userInfo.token}`,
            }
        }

        const cleanData = Object.entries(user).reduce((a,[k,v]) => (v?(a[k]=v, a) : a), {})

        let {data} = await axios.patch(
                `/api/user/me/`,
                cleanData,
                config,              
            )
            
        data = {...data, 'token': userInfo.token}

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })
    
        localStorage.setItem('userInfo', JSON.stringify(data));
        
    }catch(error){
        console.log(error.message)
        dispatch({
            type : USER_UPDATE_PROFILE_FAIL,
            payload : error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,

        })
    }
}
