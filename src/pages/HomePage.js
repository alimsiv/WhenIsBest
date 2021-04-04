import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import database from '../database/database'
import logo from "../logo.svg";
import wig from '../WIG.png'
import yeah_boi from '../yeah_boi.png'
import history from './../history'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { InfoRounded } from '@material-ui/icons';

class HomePage extends Component{

  constructor(props) {
    super(props);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.pollDBandGo = this.pollDBandGo.bind(this);
    this.createMeeting = this.createMeeting.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.loginFunciton = this.loginFunction.bind(this);

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
    // if the meeting is valid go to view page, else error
    // go to the valid view page
    
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
    
    
    //checks for the meeting code first, if found goes to view page
    const db = firebase.firestore();
    const docRef = db.collection("meetings").doc(this.state.code);
    const doc = docRef.get().then((doc) => {
          if (doc.exists) {
            history.push({
              pathname: "/view/" + this.state.code,
              state: {
              }
            }); 
          }
          else {
                  // doc.data() will be undefined in this case
                  alert("meeting code not found");
                  console.log("No such document!");
                  }
              }).catch((error) => {
                  console.log("Error getting document:", error);
              });
              //console.log("bttom")
            
  }
   

  loginFunction() {
    // need to make sure that the username and password are valid
    history.push({
      pathname: "/account",
      state: {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }
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
                <img src={yeah_boi} width="500" height="420"/>
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
                      <a href="" onClick={() => this.loginFunction() }>See your dashboard</a>
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
                      <button id="codeEnter" type = "button" onClick={() => this.pollDBandGo()}>Enter your availability</button>
                      {/* <label for="abcs"></label>
                      {<a className="mr10" href="" name="abcs"
                          onClick={() => this.pollDBandGo()}>Enter your availability</a>}
                      <br/> */}
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
