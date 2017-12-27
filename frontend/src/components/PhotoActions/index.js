import { connect } from "react-redux";
import Container from "./container";
import { actionCreators as photoAction } from "redux/module/photos";


// ownProps를 통해 컴포넌트 내 prop에 접근할 수 있다.
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleHeartClick: () => {
            if (ownProps.isLiked) {
                dispatch(photoAction.unlikePhoto(ownProps.photoId))
            } else {
                dispatch(photoAction.likePhoto(ownProps.photoId))
            }
        }
    };
};

export default connect(null, mapDispatchToProps)(Container);