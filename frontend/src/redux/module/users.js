// imports

// actions

// actions creators

// initial state
const initialState = {
    // local storage는 쿠키와 유사함.
    isLoggedIn: localStorage.getItem("jwt") || false
}

// reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

// exports

// reducer export
export default reducer;