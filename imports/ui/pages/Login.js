import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import swal from "sweetalert";

class Login extends Component {
    submitLogin(event) {
        event.preventDefault();
        const userid = ReactDOM.findDOMNode(this.refs.userid).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        Meteor.loginWithPassword(userid, password, function (error) {
            if (error) {
                swal({
                    text: error.message,
                    icon: "warning",
                    dangerMode: true
                });
            } else {
                window.location = "/";
            }
        });
    }

    render() {
        $("body").addClass("bg-black");
        $("body").removeClass("skin-blue");
        $("html").css("background-color", "#222222");
        return (
            <div className="form-box" id="login-box">
                <div className="header">Sign In</div>
                <form onSubmit={this.submitLogin.bind(this)}>
                    <div className="body bg-gray">
                        <div className="form-group">
                            <input
                                type="text"
                                name="userid"
                                ref="userid"
                                className="form-control"
                                placeholder="User ID"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                ref="password"
                                className="form-control"
                                placeholder="Password"
                            />
                        </div>
                        <div className="form-group">
                            <input type="checkbox" name="remember_me"/> Remember me
                        </div>
                    </div>
                    <div className="footer">
                        <button type="submit" className="btn bg-olive btn-block">
                            Sign me in
                        </button>

                        <p>
                            <a href="#">I forgot my password</a>
                        </p>

                        <a href="/register" className="text-center">
                            Register a new membership
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
