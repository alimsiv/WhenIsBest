import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import history from './../history'


class Setup2Page extends Component{
    
    render() {
        //get things passed from the previous page
        const state = this.props.location.state 
        return (
            <div className="Setup2Page">
                <h1>Setup2 Page</h1>
                <h2>{state.hour}</h2>

                <button onClick={() => {history.goBack(); }}> Go back </button>

                <div className="time_table">

                </div>
            </div>
        );
    }
}

export default Setup2Page;