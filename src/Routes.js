import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Router } from "react-router-dom";

import HomePage from './pages/HomePage';
import Setup1Page from './pages/Setup1Page';
import Setup2Page from './pages/Setup2Page';
import ViewPage from './pages/ViewPage';
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history} basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route exact path="/" component={ HomePage }/>
                    <Route exact path="/setup1" component={ Setup1Page }/>
                    <Route exact path="/Setup2" component={ Setup2Page }/>
                    <Route exact path="/view" component={ ViewPage }/>
                    <Route component={Error} />
                </Switch>
            </Router>
        )
    }
}