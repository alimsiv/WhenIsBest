import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'



class Setup2Page extends Component{
    render() {
        return (
            <div className="Setup2Page">
                <NavigationBar></NavigationBar>
                <head className="header">
                    <h1>Setup2 Page</h1>
                </head>

                <div className="time_table">

                </div>
            </div>
        );
    }
}

export default Setup2Page;