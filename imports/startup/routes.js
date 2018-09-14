import {Meteor} from "meteor/meteor";
import React from "react";
import {Redirect, Route, Router, Switch} from "react-router";
import createBrowserHistory from "history/createBrowserHistory";

import Dashboard from "../ui/pages/Dashboard";
import Pegawai from "../ui/pages/Pegawai";
import Pelanggan from "../ui/pages/Pelanggan";
import NotFound from "../ui/pages/NotFound";
import Register from "../ui/pages/Register";
import Login from "../ui/pages/Login";
import Supplier from "../ui/pages/Supplier";
import Diskon from "../ui/pages/Diskon";
import Produk from "../ui/pages/Produk";

const browserHistory = createBrowserHistory();
export const renderRoutes = () => {
  const isLogin = () => {
    return Meteor.userId() != null;
  };
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route
          exact
          path="/login"
          render={() => {
            if (!isLogin()) return <Login />;
            else return <Redirect to="/" />;
          }}
        />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/"
          render={() => {
            if (isLogin()) return <Dashboard />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/pegawai"
          render={() => {
            if (isLogin()) return <Pegawai />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/pelanggan"
          render={() => {
            if (isLogin()) return <Pelanggan />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/supplier"
          render={() => {
            if (isLogin()) return <Supplier />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/diskon"
          render={() => {
            if (isLogin()) return <Diskon />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/produk"
          render={() => {
            if (isLogin()) return <Produk />;
            else return <Redirect to="/login" />;
          }}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};
