import React from "react";
import Ionicon from "react-ionicons";
import formStyles from "shared/formStyles.scss";
import PropTypes from "prop-types";


export const SignupForm = (props, context) => (
    <div className={formStyles.formComponent}>
        <h3 className={formStyles.signupHeader}>
            {context.t("Sign up to see photos and videos from your friends.")}
        </h3>
        <button className={formStyles.button}>
            <Ionicon icon="logo-facebook" fontSize="20px" color="white" /> {context.t("Log in with Facebook")}
        </button>
        <span className={formStyles.divider}>or</span>
        <form className={formStyles.form} onSubmit={props.handleSubmit}>
            <input 
                type="email"
                placeholder={context.t("Email")}
                className={formStyles.textInput} 
                onChange={props.handleInputChange}
                name="email"
            />
            <input
                type="text"
                placeholder={context.t("Full Name")}
                className={formStyles.textInput}
                onChange={props.handleInputChange}
                name="fullname"
            />
            <input
                type="text"
                placeholder={context.t("Username")}
                className={formStyles.textInput}
                onChange={props.handleInputChange}
                name="username"
            />
            <input
                type="password"
                placeholder={context.t("Password")}
                className={formStyles.textInput}
                onChange={props.handleInputChange}
                name="password"              
            />
            <input type="submit" value={context.t("Sign up")} className={formStyles.button} />
        </form>
        <p className={formStyles.terms}>
            {context.t("By signing up, you agree to our")}
            <span>{context.t("Terms & Privacy Policy")}</span>.
        </p>
    </div>
);

SignupForm.propTypes = {
    usernameValue: PropTypes.string.isRequired,
    passwordValue: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

SignupForm.contextTypes = {
    t: PropTypes.func.isRequired
};

export default SignupForm;