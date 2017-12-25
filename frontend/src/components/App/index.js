import { connect } from "react-redux";
import Container from "./container";

// store 안에 변수들을 얻는 동작이다. 
// 여기서는 user.js의 스토어에서 isLoggedIn을 얻었음
// 타이머 앱 만드는 리덕스 강의에서 설명해줌
const mapStateToProps = (state, ownProps) => {
    const { user } = state;
    return {
        isLoggedIn: user.isLoggedIn // user는 reducer로써 선언하였음
    };
};

export default connect(mapStateToProps)(Container);