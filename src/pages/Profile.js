import React, { useState } from 'react' 
import { Card, Button, Alert, Container } from 'react-bootstrap'
import { useAuth, handleLogout} from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useDocument, useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../apis/firebase'
import firebase from 'firebase/app';
import { userRef } from '../database/database'

export default function Profile() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()

    const FirestoreDocument = () => {
        const [value, loading, error] = useDocument(
          firebase.firestore().doc(`users/${currentUser.uid}`),
          {
            snapshotListenOptions: { includeMetadataChanges: true },
          }
        );
        return (
          <div>
            <p>
              {error && <strong>Error: {JSON.stringify(error)}</strong>}
              {loading && <span>Document: Loading...</span>}
              {value && <span>Meetings: {JSON.stringify(value.data().meetings)}</span>}
            </p>
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
                            <FirestoreDocument/>
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
