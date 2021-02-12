import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import logo from "../logo.svg";



class HomePage extends Component{
    render() {
        return (
            <div className="HomePage">
                <header className="App-header">
                    <NavigationBar></NavigationBar>
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <p>
                        This is the Home Page
                    </p>
                </header>
            </div>

        );
    }
}

export default HomePage;