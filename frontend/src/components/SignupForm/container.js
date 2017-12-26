import React, {Component} from "react";
import PropTypes from "prop-types";
import SignupForm from "./presenter";


class Container extends Component {

    state = {
        email: "",
        name: "",
        username: "",
        password: ""
    };

    static propTypes = {
        facebookLogin: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired
    }
    
    render() {
        const {email, name, username, password } = this.state;
        return (
            <SignupForm
                handleInputChange={this._handleInputChange}
                handleSubmit={this._handleSubmit}
                handleFacebookLogin={this._handleFacebookLogin}
                emailValue={email}
                nameValue={name}
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
        event.preventDefault();

        // redux action will be here
        const { createAccount } = this.props;
        const { email, name, username, password } = this.state;
        createAccount(username, password, email, name);
    }

    _handleFacebookLogin = response => {
        console.log(response);
        const { facebookLogin } = this.props;
        facebookLogin(response.accessToken); 
    }
}

export default Container;
