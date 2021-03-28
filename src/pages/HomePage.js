import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import database from '../database/database'
import logo from "../logo.svg";
import wig from '../WIG.png'
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
    this.createMeeting = this.createMeeting.bind(this);
    this.createAccount = this.createAccount.bind(this);

    this.state = {
        code: "",
    }

}

  createMeeting() {
    history.push({pathname: "/setup1"});
  }

  createAccount() {
    history.push({pathname: "/signup"});
  }

  handleCodeChange(e){
    const {value} = e.target;
    //const ls = this.state.code;
    if(this.state.code != value){
        this.setState({code: value});
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
            <div style={{"display": "block", "width": "100%", "background-color": "pink"}}>
              <br/>
              <h1 style={{"display": "inline-block", "border-bottom": "3px solid black"}}>When is Best</h1>
              <h3>Ali, Alex, Cathy, Connor, Tommy</h3>
              <br/>
            </div>
            <br/>
            <div className="flex">
              <div className="flex-child" style={{"float": "left"}}>
                <img src={wig} width="400" height="400"/>
              </div>
              <div className="flex-child" style={{'border': "solid", "border-width": "thin", "border-radius": "5px", "background-color": "peachpuff", "width": "40%", "float": "right"}}>
                <br/>
                <h2 style={{"color": "blue"}}>Access a Meeting</h2>
                <div style={{"padding-bottom": "20px", "padding-top": "5px", "padding-right": "20px", "padding-left": "20px"}}>
                  <form>
                    <fieldset style={{'border': "solid", "border-width": "thin", "display": "block"}}>
                      <legend id="login" style={{"width": "auto", "margin-bottom": "0px", "font-size": "20px", "font-weight": "bold"}}>Login</legend>
                      <label for="username">Username: </label>
                      <input type="text" id="username" name="username"/><br/>
                      <label for="password">Password: </label>
                      <input type="text" id="password" name="password"/><br/>
                      <a href="/views">See your dashboard</a>
                    </fieldset>
                  </form>
                </div>
                <div style={{"padding-bottom": "20px", "padding-top": "10px", "padding-right": "10px", "padding-left": "10px"}}>
                  <form>
                    <fieldset style={{'border': "solid", "border-width": "thin", "display": "block"}}>
                      <legend id="wologin" style={{"width": "auto", "margin-bottom": "0px", "font-size": "20px", "font-weight": "bold"}}>Without logging in</legend>
                      <label for="code-input">Code: </label>
                      <input id="code-input" name="code-input" type="text" placeholder="e.g. Zsjf63m28sdn"
                          value={this.state.code}
                          onChange={e => this.handleCodeChange(e)}
                      /><br/>
                      <label for="abcs"></label>
                      {<a className="mr10" href="" name="abcs"
                          onClick={() => this.pollDBandGo()}>Enter your availability</a>}
                      <br/>
                    </fieldset>
                  </form>
                  <br/>
                  <div className="flex">
                    <button id="create-meeting-wo-button" onClick={() => this.createMeeting()} style={{"text-align": "center", "font-size": "16px", "color": "blue", "padding": "10px 24px", "border-radius": "8px"}}>Create a new meeting</button>
                    <button id="create-account" onClick={() => this.createAccount()} style={{"text-align": "center", "font-size": "16px", "color": "blue", "padding": "10px 24px", "border-radius": "8px"}}>Create Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
  }
}

export default HomePage;
