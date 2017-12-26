// imports

// actions
const SAVE_TOKEN = "SAVE_TOKEN";
const LOGOUT = "LOGOUT";

function saveToken(token) {
    return {
        type: SAVE_TOKEN, // type은 액션의 타입을 뜻함(임의 지정인듯)
        token
    };
}

function logout() {
    return {
        type: LOGOUT
    };
}

// API actions
// django-rest-auth 도큐먼트를 참고해보자
// redux-thunk를 사용한다.(조건이 맞을 때 디스패치하거나 디스패치 지연 등..을 위해)
function facebookLogin(access_token) {
    return dispatch => {
        fetch("/users/login/facebook/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token // 이전의 자바스크립트는 access_token: access_token으로 입력함, modern은 알아서 이해해줌
            })
        })
        .then(response => response.json())
        // .then(json => console.log(json))
        .then(json => {
            if(json.token) {
                dispatch(saveToken(json.token));
            }
        })
        .catch(err => console.log(err))
    };
}

// django-rest-auth doc의 endpoints에 다 나와있다.
function usernameLogin(username, password) {
    return dispatch => {
        fetch("rest-auth/login/", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => response.json())
        .then(json => {
            if(json.token) {
                dispatch(saveToken(json.token))
            }
        })
        .catch(err => console.log(err))
    };
}

function createAccount(username, password, email, name) {
    return dispatch => {
        fetch("/rest-auth/registration/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password1: password,
                password2: password,
                email,
                name
            })
        })
        .then(response => response.json())
        .then(json => {
            if (json.token) {
                dispatch(saveToken(json.token))
            }
        })
        .catch(err => console.log(err))
    };
}

// initial state
const initialState = {
    // local storage는 쿠키와 유사함.
    isLoggedIn: localStorage.getItem("jwt") ? true : false,
    token: localStorage.getItem("jwt")
};

// reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_TOKEN:
            return applySetToken(state, action);
        case LOGOUT:
            return applyLogout(state, action);
        default:
            return state;
    }
}

// reducer function
function applySetToken(state, action) {
    const { token } = action;
    localStorage.setItem("jwt", token);    
    return {
        ...state,
        isLoggedIn: true,
        token
    };
}

function applyLogout(state, action) {
    localStorage.removeItem("jwt");
    return {
        isLoggedIn: false
    };
}

// action creators
const actionCreators = {
    facebookLogin,
    usernameLogin,
    createAccount,
    logout
};

// exports
export { actionCreators };

// reducer export
export default reducer;