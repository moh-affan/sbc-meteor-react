import {Meteor} from "meteor/meteor";
import React, {Component} from "react";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }
  doLogout() {
    Meteor.logout(function() {
      window.location = "/login";
    });
  }
  render() {
    return (
      <header className="header">
        <a href="/" className="logo">
          SBC
        </a>
        <nav className="navbar navbar-static-top" role="navigation">
          <a
            href="#"
            className="navbar-btn sidebar-toggle"
            data-toggle="offcanvas"
            role="button"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </a>
          <div className="navbar-right">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="glyphicon glyphicon-user" />
                  <span>
                    {this.props.nama}
                    <i className="caret" />
                  </span>
                </a>
                <ul className="dropdown-menu">
                  <li className="user-header bg-light-blue">
                    <img
                      src="/images/avatar3.png"
                      className="img-circle"
                      alt="User Image"
                    />
                    <p>
                      {this.props.nama}
                      <small>Soraya Beauty Center</small>
                    </p>
                  </li>

                  <li className="user-body">
                    <div className="col-xs-12 text-center" />
                  </li>

                  <li className="user-footer">
                    <div className="pull-left">
                      <a href="/setting" className="btn btn-default btn-flat">
                        <span className="fa fa-cog" /> Setting
                      </a>
                    </div>
                    <div className="pull-right">
                      <button
                        onClick={this.doLogout.bind(this)}
                        className="btn btn-default btn-flat"
                      >
                        Sign out
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
