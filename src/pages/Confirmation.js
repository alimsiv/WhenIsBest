import React, { Component } from 'react'
import history from './../history'

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
                        <button onClick={() => {
                            history.push({ 
                                pathname: '/'})
                        }}>Home</button>
                        <button onClick={() => {
                            history.push({ 
                                    pathname: '/view/' + tableInfo.meetingID,
                                    //pass things through state
                                    })}}>Continue
                                    </button>
                    </div>
                    

            </div>
        );
    }

}
export default Confirmation;