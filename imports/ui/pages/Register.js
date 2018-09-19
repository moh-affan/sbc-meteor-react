import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {withTracker} from "meteor/react-meteor-data";
import swal from "sweetalert";
import {MPegawai} from "../../api/pegawai";
import "react-table/react-table.css";
import Select from "react-select";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {pegawai: null};
    }

    submitLogin(event) {
        event.preventDefault();
        const userid = ReactDOM.findDOMNode(this.refs.userid).value.trim();
        const pegawai = this.state.pegawai;
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
            if (pegawai == null)
                swal({
                    text: "Pegawai harus diisi",
                    dangerMode: true,
                    timer: 1000
                });
            else {
                const userObject = {
                    email: userid,
                    password: password,
                    profile: {
                        _id: pegawai.obj._id,
                        id: pegawai.obj.id,
                        nama: pegawai.obj.nama,
                    }
                };

                Accounts.createUser(userObject, function () {
                    Meteor.logout();
                    window.location = "/login";
                });
            }
        }
    }

    handlePegawaiChange = (newValue, actionMeta) => {
        this.setState({
            pegawai: newValue
        });
    };

    render() {
        $("body").addClass("bg-black").removeClass("skin-blue");
        $("html").css("background-color", "#222222");
        return (
            <div className="form-box" id="login-box">
                <div className="header">Register New Membership</div>
                <form onSubmit={this.submitLogin.bind(this)}>
                    <div className="body bg-gray">
                        <div className="form-group">
                            <Select
                                required
                                isClearable
                                placeholder="Pilih Pegawai"
                                value={this.state.pegawai}
                                onChange={this.handlePegawaiChange}
                                options={this.props.selectPegawai}
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

export default withTracker(() => {
    Meteor.subscribe("pegawai");
    const jabs = MPegawai.find().fetch();
    const selectJabs = jabs.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    return {
        selectPegawai: selectJabs,
        currentUser: Meteor.user()
    };
})(Register);
