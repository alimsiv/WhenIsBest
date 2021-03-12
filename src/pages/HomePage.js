import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import logo from "../logo.svg";


// <h1>Home Page</h1>
//<img src={logo} className="App-logo" alt="logo"/>
//<p>
//    Edit <code>src/App.js</code> and save to reload.
//</p>
//<a
//    className="App-link"
//    href="https://reactjs.org"
//    target="_blank"
//    rel="noopener noreferrer">
//    Learn React
//</a>
//<br/>
//<br/>


class HomePage extends Component{

    render() {
        return (
            <div className="HomePage">
              <h1>When is Best</h1>
              <h3>Ali, Alex, Cathy, Connor, Tommy</h3>
              <br/>

                <div className="flex">
                    <div className="flex-child">
                      <img src={logo} className="App-logo" alt="logo"/>
                    </div>

                    <div className="flex-child">
                      <h2>Access a Meeting</h2>
                        <div>
                          <h3>Login</h3>
                          <br/>
                          <div className="block">
                            <div>
                              <input id="username-input" type="text" placeholder="username"/>
                            </div>
                            <div>
                              <input id="password-input" type="text" placeholder="password"/>
                            </div>
                            <div>
                              <br/>
                              <button id="login-button">Go</button>
                            </div>
                          </div>
                          <div>
                            <br/>
                            <br/>
                            <button id="create-meeting-wo-button">Create Meeting w/o Login</button>
                            <br/>
                            <p>
                            Add availability from code...
                            </p>
                            <input id="code-input" type="text" placeholder="e.g. Zsjf63m28sdn"/>
                          </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default HomePage;
