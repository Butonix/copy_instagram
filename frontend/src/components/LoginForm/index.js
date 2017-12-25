import { connect } from "react-redux";
import Container from "./container";
import { actionCreators as userActions } from "redux/module/user";

// 액션을 리듀서에게 디스패치 하는 방법

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        facebookLogin: (access_token) => {
            dispatch(userActions.facebookLogin(access_token));
        }
    };
};

// null 자리는 원래 map state to props임. 없어서 null 처리
// 여기까지 하면, container에게 새로운 props가 전달된다.
export default connect(null, mapDispatchToProps)(Container);