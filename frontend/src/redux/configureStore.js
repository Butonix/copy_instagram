import { createStore, combineReducers } from "redux";
import users from './module/users'

const reducer = combineReducers ({
    users
})

let store = initialState => createStore(reducer);

export default store();