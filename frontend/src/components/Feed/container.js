import React, { Component } from "react";
import PropTypes from "prop-types";
import Feed from "./presenter";

class Container extends Component {
    
    state = {
        loading: true
    };

    static propTypes = {
        getFeed: PropTypes.func.isRequired,
        feed: PropTypes.array // 항상 요구되는 것은 아니다.
    };

    componentDidMount() {
        const { getFeed } = this.props;
        getFeed();
    } 

    // 이것도 내장 함수로 존재.
    // 로딩중을 끝내려면 새로운 Props가 들어온 것을 확인해야 한다.
    // 이 떄 사용하는 것이 아래의 함수다.
    componentWillReceiveProps = (nextProps) => {
        // 초기 상태와 다음 상태의 비교를 통해 새로운 Props가 들어왔는지 검사한다.
        // console.log(this.props); 초기 상태
        // console.log(nextProps); 다음 상태

        if( nextProps.feed) {
            this.setState({
                loading: false
            });
        }
    };

    render() {
        const { feed } = this.props;
        return <Feed {...this.state} feed={feed}/>
    }
}

export default Container;