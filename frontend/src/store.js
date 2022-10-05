import {
    createStore,
    applyMiddleware,
    combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    userLoginReducers,
} from './reducers/userReducers'

const reducer = combineReducers({
    token: userLoginReducers,
})

const initialState = {
    token: {userToken: localStorage.getItem('token')? JSON.parse(localStorage.getItem('token')): null},
}

const mmiddleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...mmiddleware)))

export default store;