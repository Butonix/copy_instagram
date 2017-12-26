// imports
import { actionCreators as userActions } from "redux/module/user";


// actions

// action creators

// api actions
// 좀 다른 방식의 dispatch를 사용하고 있다(user와 비교해보자)
// 왜 여기서는 getState 방식을 쓰느냐고 묻는다면 getState는 현재 state를 가져온다.
// state에 토큰을 저장해서 API Request를 만들 때마다 state를 다시 가져와서 사용
function getFeed() {
    return (dispatch, getState) => {
        const { user: { token } } = getState();
        fetch("/images/", {
            method: "GET",
            headers: {
                Authorization: `JWT ${token}`
            }
        })
        .then(response => {
            if( response.status === 401) {
                dispatch(userActions.logout());
            } else {
                return response.json();
            }
        })
        .then(json => console.log(json))
        .catch(err => console.log(err))
    };
}


// initial state
const initialState = {
    feed: []
};

// reducer
function reducer(state = initialState, action) {
    switch(action.type) {
        default:
            return state;
    }
}

// reducer functions

// action creators
const actionCreators = {
    getFeed
};

// exports
export { actionCreators };

// default reducer export
export default reducer;