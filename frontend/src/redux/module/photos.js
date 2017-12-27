// imports
import { actionCreators as userActions } from "redux/module/user";

// actions
const SET_FEED = "SET_FEED";
const LIKE_PHOTO = "LIKE_PHOTO";
const UNLIKE_PHOTO = "UNLIKE_PHOTO";

// action creators
function setFeed(feed) {
    return {
        type: SET_FEED,
        feed
    };
}

function doLikePhoto(photoId) {
    return {
        type: LIKE_PHOTO,
        photoId
    };
}

function doUnlikePhoto(photoId) {
    return {
        type: UNLIKE_PHOTO,
        photoId
    };
}

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
        .then(json => dispatch(setFeed(json)))
        .catch(err => console.log(err))
    };
}

function likePhoto(photoId) {
    return (dispatch, getState) => {

         // 왜 이렇게 작성하냐면 좋아요를 누르면 바로 즉시 당장 피드백을 유저에게 바로 줘야함
         // 하트 색칠을 서버 거치고 해서 오래걸리면 사용자가 짜증냄
         // 이런 것을 optimistic update 라고 함
         // 오류가 났으면 좋아요를 취소하면 됨 ( 기다리게 하느 것보다 훨씬 나음 )
        dispatch(doLikePhoto(photoId));
        const { user: { token } } = getState()
        fetch(`/images/${photoId}/likes/`, {
            method: "POST",
            headers: {
                Authorization: `JWT ${token}`
            }
        })
        .then(response => {
            if(response.statue === 401) {
                dispatch(userActions.logout());
            } else if(!response.ok) {
                dispatch(doUnlikePhoto(photoId));
            }
        });
    }
}

function unlikePhoto(photoId) {
    return (dispatch, getState) => {

        dispatch(doUnlikePhoto(photoId));
        const { user: { token } } = getState()
        fetch(`/images/${photoId}/unlikes/`, {
            method: "DELETE",
            headers: {
                Authorization: `JWT ${token}`
            }
        })
            .then(response => {
                if (response.statue === 401) {
                    dispatch(userActions.logout());
                } else if (!response.ok) {
                    dispatch(doLikePhoto(photoId));
                }
            });
    }
}

// initial state
const initialState = {};

// reducer
function reducer(state = initialState, action) {
    switch(action.type) {
        case SET_FEED:
            return applySetFeed(state, action);
        case LIKE_PHOTO:
            return applyLikePhoto(state, action);
        case UNLIKE_PHOTO:
            return applyUnlikePhoto(state, action);

        default:
            return state;
    }
}

// reducer functions
function applySetFeed(state, action) {
    const { feed } = action;
    return {
        ...state,
        feed
    }
}

function applyLikePhoto(state, action) {
    const { photoId } = action;
    const { feed } = state;
    const updatedFeed = feed.map(photo => {
        if(photo.id === photoId) {
            return {...photo, is_liked:true, like_count: photo.like_count+1}
        }
        else {
            return photo;
        }
    });

    return {...state, feed: updatedFeed};
}

function applyUnlikePhoto(state, action) {
    const { photoId } = action;
    const { feed } = state;
    const updatedFeed = feed.map(photo => {
        if (photo.id === photoId) {
            return { ...photo, is_liked: false, like_count: photo.like_count - 1 }
        }
        else {
            return photo;
        }
    });

    return { ...state, feed: updatedFeed };
}

// action creators
const actionCreators = {
    getFeed,
    likePhoto,
    unlikePhoto
};

// exports
export { actionCreators };

// default reducer export
export default reducer;