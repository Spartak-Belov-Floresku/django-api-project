import {
    createStore,
    applyMiddleware,
    combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    userLoginReducers,
    userRegisterReducers,
} from './reducers/userReducers'

const reducer = combineReducers({
    userLogedIn: userLoginReducers,
    userRegister: userRegisterReducers,
})

const initialState = {
    userLogedIn: {userInfo: localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')): null},
}

const mmiddleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...mmiddleware)))

export default store;