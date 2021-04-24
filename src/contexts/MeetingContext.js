import React, { useContext, useState, useEffect } from 'react'
import { MeetingArray } from '../database/database'
import firebase from 'firebase/app';
import { useAuth } from '../contexts/AuthContext'
import { auth, firestore } from '../apis/firebase'
import { useDocument, useCollectionData } from 'react-firebase-hooks/firestore'
import { Card, Button, Alert, Container, Nav } from 'react-bootstrap'

const MeetingContext = React.createContext()

export function useMeeting() {
    return useContext(MeetingContext)
}

export function MeetingProvider({ children }) { 
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true)
    const [value] = useDocument(firebase.firestore().doc(`users/${currentUser.uid}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [meetings, setMeetings] = useState()

    async function getMeetings() {
        let meetings = [];
        if (value != null) {
            const meetingsList = value.data().meetings;
            for (let i = 0; i < meetingsList.length; i++) {
                await firebase.firestore().collection('meetings').doc(meetingsList[i].toString()).get().then((doc) => {
                    if(doc.exists) {
                        meetings.push(
                            <Nav.Link key={meetingsList[i]} href={"/view/" + meetingsList[i].toString()}>{doc.data().name}</Nav.Link>)
                    }
                });
            }
        }
        console.log(meetings)
        return (
            <div>
                {meetings && <Nav className="flex-column">{ meetings }</Nav>}
            </div>
        );
    };

    useEffect(() => {
        setMeetings(getMeetings())
        if(meetings == null || meetings.length !== 0)
            setLoading(false)
    }, [value])

    const info = {
        meetings,
        getMeetings
    }

    return (
        <MeetingContext.Provider value={ info }>
            {!loading && children}
        </MeetingContext.Provider>
    )
}