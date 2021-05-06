import { Component } from 'react'
import logo from "../logo.svg";
import history from './../history'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link, } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

class HomePage extends Component{

  constructor(props) {
    super(props);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.pollDBandGo = this.pollDBandGo.bind(this);
    this.createMeeting = this.createMeeting.bind(this);
    this.viewMeetings = this.viewMeetings.bind(this);
    this.accessMeeting = this.accessMeeting.bind(this);

    this.state = {
        code: "",
    }

}

  createMeeting() {
    history.push({pathname: "/setup1"});
  }

  viewMeetings() {
    // :TODO need error code for when someone is not logged in since it cant redirect to profile
    history.push({pathname: "/profile"});
  }

  accessMeeting(e) {
    history.push({pathname: "/view/" + this.state.code});
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

    if(this.state.code != ""){
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
    else{
      console.log("no meeting code entered")
    }
  }

    render() {
      return (
          <div className="HomePage">
            <div className="flex">

              <div className="flex-child" width="40%" height="40%" style={{"float": "left"}}>
                <img src={logo} width="400" height="400"/>
                <p>"WhenIsBest allows for the creation of groups and the ability
                to weigh the importance of attendance <br/> for both individuals and groups.
                Additionally, WhenIsBest allows individuals to indicate general availability <br/>
                versus preferred availability. The app then embeds a prioritization feature
                into its algorithm that considers the weighted values of individuals and groups
                and each individual’s preferences when calculating the most ideal meeting time.
                Meeting time options are visualized in a comprehensive yet easily filterable
                heat map that allows for the identification of the best time."
                </p>
              </div>
              <>
                <Container className="d-flex align-tems-center justify-content-center" style={{ minHeight: "100vh" }}>
                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">Welcome to WhenIsBest</h2>

                                <Card>
                                  <Card.Body>
                                    <Form>
                                        <Form.Group id="access-meeting">
                                            <Form.Label>Enter Code</Form.Label>
                                            <Form.Control type="text" onChange={this.handleCodeChange}/>
                                        </Form.Group>

                                        <Button className="w-100" type="button" onClick={this.pollDBandGo}>
                                            Access Meeting
                                        </Button>
                                    </Form>
                                  </Card.Body>
                                </Card>
                                <br/>
                                <Card>
                                  <Card.Body>
                                    <Form>
                                      <Form.Group id="your-meetings">
                                          <Form.Label>Your Meetings</Form.Label>
                                      </Form.Group>
                                      <Form.Group id="your-meetings">
                                        <Button id="create-meeting" style={{"margin-right": "5px"}} onClick={() => this.createMeeting()}>
                                          Create a Meeting
                                        </Button>
                                        <Button id="view-meetings" onClick={() => this.viewMeetings()}>
                                          View My Meetings
                                        </Button>
                                      </Form.Group>
                                    </Form>
                                  </Card.Body>
                                </Card>

                            </Card.Body>
                        </Card>
                          <div className="w-100 text-center mt-2">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                          </div>
                    </div>
                </Container>
              </>

            </div>

          </div>
      );
  }
}

export default HomePage;
