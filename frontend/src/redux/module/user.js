// imports

// actions
const SAVE_TOKEN = "SAVE_TOKEN";

// action creators
function saveToken(token) {
    return {
        type: SAVE_TOKEN, // type은 액션의 타입을 뜻함(임의 지정인듯)
        token
    };
}

// API actions
// django-rest-auth 도큐먼트를 참고해보자
// redux-thunk를 사용한다.(조건이 맞을 때 디스패치하거나 디스패치 지연 등..을 위해)
function facebookLogin(access_token) {
    return function(dispatch) {
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
                localStorage.setItem("jwt", json.token);
                dispatch(saveToken(json.token));
            }
        })
        .catch(err => console.log(err))
    }
}

// initial state
const initialState = {
    // local storage는 쿠키와 유사함.
    isLoggedIn: localStorage.getItem("jwt") ? true : false
};

// reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_TOKEN:
            return applySetToken(state, action);
        default:
            return state;
    }
}

// reducer function
function applySetToken(state, action) {
    const { token } = action;
    return {
        ...state,
        isLoggedIn: true,
        token
    };
}

// action creators
const actionCreators = {
    facebookLogin
};

// exports
export { actionCreators };

// reducer export
export default reducer;