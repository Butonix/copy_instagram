import React, {Component} from "react";
import PropTypes from "prop-types";
import SignupForm from "./presenter";


class Container extends Component {

    state = {
        email: "",
        fullname: "",
        username: "",
        password: ""
    };

    static propTypes = {
        facebookLogin: PropTypes.func.isRequired
    }
    
    render() {
        const {email, fullname, username, password } = this.state;
        return (
            <SignupForm
                handleInputChange={this._handleInputChange}
                handleSubmit={this._handleSubmit}
                handleFacebookLogin={this._handleFacebookLogin}
                emailValue={email}
                fullnameValue={fullname}
                usernameValue={username}
                passwordValue={password}
            />
        );
    }

    _handleInputChange = event => {
        const { target: { value, name } } = event;
        this.setState({
            [name]: value // [name]은 이벤트 발생시 반환되는 username, password 를 뜻함.
        });
    };

    _handleSubmit = event => {
        // 브라우저가 디폴트 작업을 수행하지 않도록 막는 함수
        // <input type button으로 막는 것이 아닌, 이 문장을 씀으로써 submit으로
        // 기존 동작을 거부할 수 있다.
        event.preventDefault();
        // redux action will be here
    }

    _handleFacebookLogin = response => {
        console.log(response);
        const { facebookLogin } = this.props;
        facebookLogin(response.accessToken); 
    }
}

export default Container;
