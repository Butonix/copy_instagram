import React from "react";
import formStyles from "shared/formStyles.scss";
import FacebookLogin from "react-facebook-login";
import PropTypes from "prop-types";


export const LoginForm = (props, context) => (
    <div className={formStyles.formComponent}>
        <form className={formStyles.form} onSubmit={props.handleSubmit}> 
            <input 
                type="text"
                placeholder={context.t("Username")}
                className={formStyles.textInput}
                value={props.usernameValue}
                onChange={props.handleInputChange}
                name="username"
            />
            <input
                type="password"
                placeholder={context.t("Password")}
                className={formStyles.textInput}
                value={props.passwordValue}
                onChange={props.handleInputChange}
                name="password"
            />
            <input
                type="submit"
                value={context.t("Log in")}
                className={formStyles.button}
            />
        </form>
        <span className={formStyles.divider}>or</span>
        <span>
            {/* Ionicon은 facebook 컴포넌트와 연동이 안되서 지움 */}
            {/* <Ionicon icon="logo-facebook" fontSize="20px" color="#385185" /> {context.t("Log in with Facebook")} */}
            <FacebookLogin
                appId="1970800653246350"
                autoLoad={false}
                fields="name,email,picture"
                callback={props.handleFacebookLogin} 
                cssClass={formStyles.facebookLink}    
                icon="fa-facebook-square" // icon은 awsome icon과 연동된다. http://fontawesome.io/icon
                textButton={context.t("Log in with Facebook")}
            />
        </span>
        <span className={formStyles.forgotLink}> {context.t("Forgot password?")} </span>
    </div>  
);

LoginForm.propTypes = {
    usernameValue: PropTypes.string.isRequired,
    passwordValue: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleFacebookLogin: PropTypes.func.isRequired
};

LoginForm.contextTypes = {
    t: PropTypes.func.isRequired
};

export default LoginForm;