import { Component } from 'react'
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage'
import Setup1Page from './pages/Setup1Page'
import Setup2Page from './pages/Setup2Page'
import ViewPage from './pages/ViewPage'

import logo from './logo.svg';
import NavigationBar from './shared/NavigationBar'
import Nav from 'react-bootstrap/Nav'
import './App.css';

class App extends Component{
  render() {
    return (
        <div className="App">
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route exact path="/" component={ HomePage }/>
                    <Route exact path="/setup1" component={ Setup1Page }/>
                    <Route exact path="/setup2" component={ Setup2Page }/>
                    <Route exact path="/view" component={ ViewPage }/>
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
        </div>
    );
  }
}

export default App;
