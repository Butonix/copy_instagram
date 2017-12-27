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
        if( !this.props.feed ) {
            // 피드가 존재하지 않을 때만 요청하는 것으로 변경한다.
            getFeed();
        } else {
            this.setState ({
                // 이게 생각보다 되게 중요하다.
                // 만약 이게 없으면 왓다갓다할 때마다 계속 요청하기 때문이다..
                // 컴포넌트가 다시 마운트 될 때 loading이 true이므로 재조정한다.
                loading: false
            })
        }
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