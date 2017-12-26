import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { composeWithDevTools } from "redux-devtools-extension";
import { i18nState } from "redux-i18n";
import user from "redux/module/user";
import photos from "redux/module/photos";
// import Reactotron from "ReactotronConfig";

// 이 변수는 nodejs의 전체 정보를 갖고 있다.
// 현재 나의 코드가 dev인지 prod인지 확인 가능
// .NODE_ENV를 붙임으로서 브라우저에 저장
const env = process.env.NODE_ENV;

const history = createHistory();

// 글로벌 단위로 미들웨어 적용
// 설치할 때 --dev 안 붙이면됨(붙이면 dev)
// package.json에서 확인해보면 알 수 있음.
const middlewares = [thunk, routerMiddleware(history)]

// dev일 떄만 redux logger를 부른다.
// 리덕스(미들)에서 이뤄지는 action과 state에 대한 로그를 확인할 수 있다.
if(env === "development") {
    const { logger } = require("redux-logger");
    middlewares.push(logger);
}

const reducer = combineReducers ({
    user,
    photos,
    routing: routerReducer,
    i18nState
});

// ...은 array를 unpack하는 것
// es6console.com 에서 다음과 같이 테스트 해보면 차이를 알 수 있다.
// 1) const middlewares = [1, 2, 3, 4];
// 2-1) console.log(middlewares) 결과 : [1,2,3,4]
// 2-2) console.log(...middlewares) 결과 : 1 2 3 4

// 상태가 dev일 때 store를 reactotron과 연결시킴. (취소)
// 상태가 dev일 때 store를 redux-dev-tools와 연결시킴
let store;
if(env === "development") {
    store = initialState => createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));
} else {
    store = initialState => createStore(reducer, applyMiddleware(...middlewares));
}

export { history };

export default store();