import React, { Component } from 'react'
import history from './../history'
import { Button } from 'react-bootstrap'

class Confirmation extends Component{



render() {
        var tableInfo = this.props.location.state;
        return (
            <div className="ConfirmationPage">
                <h1>Confirmation Page</h1>

                    <div>
                    <p>Give this code to people to fill out form</p>
                    {tableInfo.meetingID}
                    </div>
                    <div className="flex-child">
                        {
                            //TODO: input from user
                        }
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <p>Press continue to fill out the form for yourself, or exit to go back home.</p>
                        <Button style={{"marginRight": "5px"}} onClick={() => {
                            history.push({ 
                                pathname: '/'})
                        }}>Home</Button>
                        <Button onClick={() => {
                            history.push({ 
                                    pathname: '/view/' + tableInfo.meetingID,
                                    //pass things through state
                                    })}}>Continue
                                    </Button>
                    </div>
                    

            </div>
        );
    }

}
export default Confirmation;