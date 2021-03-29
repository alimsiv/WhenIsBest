import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Router } from "react-router-dom";

import HomePage from './pages/HomePage';
import Setup1Page from './pages/Setup1Page';
import Setup2Page from './pages/Setup2Page';
import ViewPage from './pages/ViewPage';
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Confirmation from './pages/Confirmation';
import history from './history';
import PrivateRoute from './PrivateRoutes'
import ForgotPassword from './pages/ForgotPassword'
import UpdateProfile from './pages/UpdateProfile'

export default class Routes extends Component {
    render() {
        return (
            <Router history={history} basename={process.env.PUBLIC_URL}>
                <Switch>
                    <PrivateRoute exact path="/profile" component = { Profile }/>
                    <PrivateRoute exact path="/update-profile" component = { UpdateProfile }/>
                    <Route exact path="/" component={ HomePage }/>
                    <Route exact path="/setup1" component={ Setup1Page }/>
                    <Route exact path="/Setup2" component={ Setup2Page }/>
                    <Route exact path="/view/:meetingID" component={ ViewPage }/>
                    <Route exact path="/signup" component={ SignUp }/>
                    <Route exact path="/login" component={ Login }/>
                    <Route exact path="/forgot-password" component={ ForgotPassword }/>
                    <Route exact path="/confirmation" component={Confirmation}/>
                    <Route component={Error} />
                </Switch>
            </Router>
        )
    }
}