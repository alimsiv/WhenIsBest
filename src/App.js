import { Component } from 'react'
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage'
import Setup1Page from './pages/Setup1Page'
import Setup2Page from './pages/Setup2Page'
import ViewPage from './pages/ViewPage'
import history from './history';
import { AuthProvider } from './contexts/AuthContext'
import { MeetingProvider } from './contexts/MeetingContext'
import logo from './logo.svg';
import NavigationBar from './shared/NavigationBar'
import Routes from './Routes';
import Nav from 'react-bootstrap/Nav'
import './App.css';

class App extends Component{
  render() {
    return (
        <div className="App">
            <AuthProvider>
              <MeetingProvider>
                <NavigationBar />
                <Routes />
              </MeetingProvider>
            </AuthProvider>
        </div>
    );
  }
}

export default App;
