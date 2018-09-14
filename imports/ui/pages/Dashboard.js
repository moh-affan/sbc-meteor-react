import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../containers/Header";
import Sidemenu from "../containers/Sidemenu";

class Content extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <aside className="right-side">
        <section className="content-header">
          <h1>
            Dashboard
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <a href="#">
                <i className="fa fa-dashboard" /> Home
              </a>
            </li>
            <li className="active">Dashboard</li>
          </ol>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>Point of Sales</h2>
              <h2>Soraya Beauty Center</h2>
            </div>
          </div>

          <div className="row">
            <section className="col-lg-12 connectedSortable">
              <div className="box box-warning">
                <div className="box-header">
                  <i className="fa fa-calendar" />
                  <div className="box-title">Kalender</div>
                </div>
                <div className="box-body no-padding">
                  <div id="calendar" />
                </div>
              </div>
            </section>
          </div>
        </section>
      </aside>
    );
  }
}

class Dashboard extends Component {
  render() {
    var pengguna = "Pengguna";
    if (this.props.currentUser) {
      pengguna = this.props.currentUser.emails[0].address;
    }
    return (
      <div className="body">
        <Header nama={pengguna} />
        <div className="wrapper row-offcanvas row-offcanvas-left">
          <Sidemenu activeMenu="dashboard" nama={pengguna} />
          <Content />
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(Dashboard);
