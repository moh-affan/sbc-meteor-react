import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import swal from "sweetalert";

class Register extends Component {
    submitLogin(event) {
        event.preventDefault();
        const userid = ReactDOM.findDOMNode(this.refs.userid).value.trim();
        const nama = ReactDOM.findDOMNode(this.refs.nama).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        const password2 = ReactDOM.findDOMNode(this.refs.password2).value.trim();
        if (password !== password2) {
            swal({
                title: "Password Salah",
                text: "Password Tidak Cocok",
                icon: "warning",
                dangerMode: true
            });
        } else {
            const userObject = {
                email: userid,
                password: password
            };

            Accounts.createUser(userObject, function () {
                Meteor.logout();
                window.location = "/login";
            });
        }
    }

    render() {
        $("body").addClass("bg-black").removeClass("skin-blue");
        // $("body");
        $("html").css("background-color", "#222222");
        return (
            <div className="form-box" id="login-box">
                <div className="header">Register New Membership</div>
                <form onSubmit={this.submitLogin.bind(this)}>
                    <div className="body bg-gray">
                        <div className="form-group">
                            <input
                                type="text"
                                name="nama"
                                ref="nama"
                                className="form-control"
                                placeholder="Full name"
                            />
                        </div>
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
                            <input
                                type="password"
                                name="password2"
                                ref="password2"
                                className="form-control"
                                placeholder="Retype password"
                            />
                        </div>
                    </div>
                    <div className="footer">
                        <button type="submit" className="btn bg-olive btn-block">
                            Sign me up
                        </button>

                        <a href="/login" className="text-center">
                            I already have a membership
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;
