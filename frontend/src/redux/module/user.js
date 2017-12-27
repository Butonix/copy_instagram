// imports

// actions
const SAVE_TOKEN = "SAVE_TOKEN";
const LOGOUT = "LOGOUT";
const SET_USER_LIST = "SET_USER_LIST";
const FOLLOW_USER = "FOLLOW_USER";
const UNFOLLOW_USER = "UNFOLLOW_USER";

// action creators
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

function setUserList(userList) {
    return {
        type: SET_USER_LIST,
        userList 
    };
}

function setFollowUser(userId) {
    return {
        type: FOLLOW_USER,
        userId
    };
}

function setUnfollowUser(userId) {
    return {
        type: UNFOLLOW_USER,
        userId
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

function getPhotoLikes(photoId) {
    return (dispatch, getState) => {
        const { user: { token } } = getState()
        fetch(`/images/${photoId}/likes/`, {
            method: "GET",
            headers: {
                Authorization: `JWT ${token}`,
            },
        })
        .then(response => {
            if (response.status === 401) {
                dispatch(logout());
            }
            return response.json()
        })
        .then(json => {
            dispatch(setUserList(json));
        })
    }
}

function followUser(userId) {
    return (dispatch, getState) => {
        // optimistic update
        dispatch(setFollowUser(userId));

        const { user : { token } } = getState();
        fetch(`/users/${userId}/follow/`, {
            method: "POST",
            headers: {
                Authorization: `JWT ${token}`,
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            if(response.statue === 401) {
                dispatch(logout())
            } else if ( !response.ok) {
                dispatch(setUnfollowUser(userId));
            }
        });
    };
}

function unfollowUser(userId) {
    return (dispatch, getState) => {
        dispatch(setUnfollowUser(userId));
        
        const { user: { token } } = getState();
        fetch(`/users/${userId}/unfollow/`, {
            method: "POST",
            headers: {
                Authorization: `JWT ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (response.statue === 401) {
                    dispatch(logout())
                } else if (!response.ok) {
                    dispatch(setFollowUser(userId));
                }
            });
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
        case SET_USER_LIST:
            return applySetUserList(state, action);
        case FOLLOW_USER:
            return applyFollowUser(state, action);
        case UNFOLLOW_USER:
            return applyUnfollowUser(state, action);
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

function applySetUserList(state, action) {
    const { userList } = action;
    return {
        ...state,
        userList
    };
}

function applyFollowUser(state, action) {
    const { userId } = action;
    const { userList } = state;
    const updatedUserList = userList.map(user => {
        if(user.id === userId) {
            return {...user, following: true }
        }
        return user;
    })

    return {...state, userList: updatedUserList}
}

function applyUnfollowUser(state, action) {
    const { userId } = action;
    const { userList } = state;
    const updatedUserList = userList.map(user => {
        if (user.id === userId) {
            return { ...user, following: false }
        }
        return user;
    })

    return { ...state, userList: updatedUserList }
}

// action creators
const actionCreators = {
    facebookLogin,
    usernameLogin,
    createAccount,
    logout,
    getPhotoLikes,
    followUser,
    unfollowUser
};

// exports
export { actionCreators };

// reducer export
export default reducer;