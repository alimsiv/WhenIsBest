import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import logo from "../logo.svg";
import history from './../history'

import firebase from 'firebase/app';
import 'firebase/firestore';
import { InfoRounded } from '@material-ui/icons';
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

  constructor(props) {
    super(props);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.pollDBandGo = this.pollDBandGo.bind(this);
    this.state = {
        code: "",
    }

}

  handleCodeChange(e){
    const {value} = e.target;
    //const ls = this.state.code;
    if(this.state.code != value){
        this.setState({code: value});
        console.log(value);
    }
  }

  fixTable(oneDtable,cols){
    var twoDTable = [];
    var row;
    while(oneDtable.length > 0){
      row = oneDtable.splice(0,cols);
      twoDTable.push(row);
    }

    return twoDTable;
  }

  fixDays(days){
    var fixed = [];
    days.forEach(day => fixed.push(new Date(day.seconds * 1000)));
    return fixed;
  }

  pollDBandGo(){
    console.log("go");
    const db = firebase.firestore();
    var docRef = db.collection("meetings").doc(this.state.code);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const info = doc.data();
            var twoDTable = this.fixTable(info.showTimeSlot,info.tableCol);
            var days;
            if(info.type == 1){
            //twoDTable = this.fixTable(info.showTimeSlot,info.tableCol);
              days = info.days;
            }
            else{
              days = this.fixDays(info.days);
            }
            console.log("Document data:", days);
            history.push({ 
              pathname: '/view',
              //pass things through state
              state: {
                      days: days,
                      minStart:info.minStart,
                      showTimeSlotTable:twoDTable,
                      type: info.type,
                      name: info.name,
                      hostID: info.hostID,
                  }
              })
        } else {
            // doc.data() will be undefined in this case
            alert("meeting code not found");
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  }


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
                            <div>
                            <input id="code-input" type="text" placeholder="e.g. Zsjf63m28sdn"
                                value={this.state.code}
                                onChange={e => this.handleCodeChange(e)}
                            />
                            {<button className="mr10"
                                onClick={() => this.pollDBandGo()}>Go</button>}
                            </div>
                          </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default HomePage;
