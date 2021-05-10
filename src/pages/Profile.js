import React, { useState, useAsync } from 'react'
import { Card, Button, Alert, Container, Nav } from 'react-bootstrap'
import { useAuth, handleLogout } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'

export default function Profile() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    
    const Meetings = () => {
        let meetingsList = []
        let meetings = [];

        const [docValue] = useDocument(
          firebase.firestore().doc(`users/${currentUser.uid}`),
          {
            snapshotListenOptions: { includeMetadataChanges: true },
          }
        );

        const [collectValue] = useCollection(
            firebase.firestore().collection('meetings'),
          {
            snapshotListenOptions: { includeMetadataChanges: true },
          }
        );

        if (docValue != null) { 
            meetingsList = docValue.data().meetings;
            for (let i = 0; i < meetingsList.length; i++) {
                const meeting = meetingsList[i]
                if(collectValue != null) {
                    const docArray = collectValue.docs
                    for(let j = 0; j < docArray.length; j++) {
                        let name = ''
                        if(docArray[j].id == meeting.toString()) {
                            name = docArray[j].data().name
                            meetings.push(
                                <Nav.Link key={meeting} href={"/view/" + meeting.toString()}>{name}</Nav.Link>
                            )
                        }
                    }
                }
            }   
        }
        console.log(meetings)
        return (
          <div>
            {meetings && <Nav className="flex-column">{ meetings }</Nav>}
          </div>
        );
      };

    return (
        <>
            <Container className="d-flex align-tems-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "800px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Profile</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <strong>Email:</strong> {currentUser.email}
                            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                                Update Profile
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Upcoming Meetings</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Meetings/>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        <Button variant="link" onClick={() => handleLogout(setError, logout)}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    )
}