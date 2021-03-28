import React, { Component } from 'react'
import history from './../history'

class Confirmation extends Component{



render() {
        var tableInfo = this.props.location.state;
        return (
            <div className="ConfirmationPage">
                <h1>Confirmation Page</h1>

                    <div>
                    <p>Give this Code to people to fill out form</p>
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
                        <p>press continue to fill out the form for yourself, or exit to go back home</p>
                        <button onClick={() => {
                            history.push({ 
                                pathname: '/'})
                        }}>Home</button>
                        <button onClick={() => {
                            history.push({ 
                                    pathname: '/view',
                                    //pass things through state
                                    state: {
                                            days: tableInfo.days,
                                            minStart: tableInfo.minStart,
                                            showTimeSlotTable: tableInfo.showTimeSlotTable,
                                            type: tableInfo.type,
                                            meetingID:tableInfo.meetingID,
                                            priorityType:tableInfo.priorityType,
                                            groupList:tableInfo.groupList,
                                        }
                                    })}}>Continue
                                    </button>
                    </div>
                    

            </div>
        );
    }

}
export default Confirmation;