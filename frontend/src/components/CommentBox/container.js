import React, { Component } from "react";
import CommentBox from "./presenter";

class Container extends Component {
    state = {
        comment: ""
    };

    render() {
        return (
            <CommentBox 
                handleInputChange={this._handleInputChange}
                handleKeyPress={this._handleKeyPress}
                {...this.state} 
            />
        );
    }

    _handleInputChange = (event) => {
        const { target : { value } } = event;
        this.setState({
            comment: value
        });
    };

    _handleKeyPress = event => {
        const { key } = event;
         
         // 엔터치면 줄 바꿈되는 기본 동작 막기
        if( key === "Enter" ) {
            event.preventDefault();
        } 

        
    };
}

export default Container;