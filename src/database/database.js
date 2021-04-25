import firebase from 'firebase/app';
import { useAuth } from '../contexts/AuthContext'
import { auth, firestore } from '../apis/firebase'
import { useDocument, useCollectionData } from 'react-firebase-hooks/firestore'
import { Card, Button, Alert, Container, Nav } from 'react-bootstrap'

//import firebase from '../apis/firebase';

import { useAuthState } from 'react-firebase-hooks/auth';


//const auth = firebase.auth();
//const firestore = firebase.firestore();

const meetingRef = (meetingID) => {
    const db = firebase.firestore();
    return db.collection("meetings").doc(meetingID);
}

const responsesRef = (meetingID) => {
    return meetingRef(meetingID).collection("responses");
}

const userRef = (userID) => {
    const db = firebase.firestore();
    return db.collection("users").doc(userID);
}

/***
 * Return a all info for a given meeting
 * @param code
 */
export async function getMeetingInfo(code) {
    //const docRef = meetingsRef.doc(code);
    const doc = await meetingRef(code).get();
    if (doc.exists) {
        return doc.data()
    } else {
        // doc.data() will be undefined in this case
        alert("meeting code not found");
        console.log("No such document!");
    }
}


/***
 * Returns a list of people responses for a given meeting
 * Each entry has the fields: name, availability, group, id, priority
 * @param code
 */
export async function getResponses(code) {
    const responses = [];
    const responsesCollection = await responsesRef(code).get();
    if (responsesCollection != null) {

        responsesCollection.forEach((doc) => responses.push({ ...doc.data(), id: doc.id, priority: 3, show: true }));
    }
    console.log(responses);
    return responses;
}

export function addResponseToDB(meetingID, name, group, responses) {
    const docRef = responsesRef(meetingID).doc();

    docRef.set({
        name: name,
        availability: responses.flat(),
        group: group
    })
    return docRef.id;
}

export function updateResponseInDB(meetingID, id, name, responses) {
    responsesRef(meetingID).doc(id).update({
        name: name,
        availability: responses.flat(),
    })
}

export function addMeetingToUser(meetingID) {
    //const uid = auth.currentUser.uid;
    if (auth.currentUser != null) {
        try {
            userRef(auth.currentUser.uid).update({
                meetings: firebase.firestore.FieldValue.arrayUnion(meetingID),
            });
        }
        catch {
            console.log("User does not exist")
        }
    }
}

export async function getUserMeetings(userID) {
    const doc = await userRef(userID).get();
    if (doc.exists) {
        return doc.data().meetings;
    } else {
        // doc.data() will be undefined in this case
        alert("No such user or user has no meetings yet.");
        console.log("No such document!");
    }
}

export function fixTable(oneDtable, cols) {
    var twoDTable = [];
    var row;
    while (oneDtable.length > 0) {
        row = oneDtable.splice(0, cols);
        twoDTable.push(row);
    }

    return twoDTable;
}

export function fixDays(days) {
    var fixed = [];
    days.forEach(day => fixed.push(new Date(day.seconds * 1000)));
    return fixed;
}

/*
function FirebaseListen() {
    const responsesRef = getEventRef('J56Kk1Q3sKK9R15Z94dt').collection('responses');
    const [responses] = useCollectionData(responsesRef, {idField: 'id'})

    //const [availability, setAvailability] = useState('');
}
 */

// value={availability} onChange={(e) =! setAvailability(e.target.value)}

export const FirestoreDocument = () => {
    const { currentUser } = useAuth();
    let meetings = [];
    const [value, loading, error] = useDocument(
        firebase.firestore().doc(`users/${currentUser.uid}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    if (value != null) {
        const meetingsList = value.data().meetings;
        for (let i = 0; i < meetingsList.length; i++) {
            //const { execute, status, value, error } = useAsync(getMeetingInfo(meetingsList[i]), false);
            //const meetingData = await getMeetingInfo(meetingsList[i]);
            //console.log(meetingData);
            meetings.push(
                <Nav.Link key={meetingsList[i]} href={"/view/" + meetingsList[i].toString()}>{meetingsList[i].toString()}</Nav.Link>
            );
        }
    }
    return (
        <div>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Document: Loading...</span>}
            {meetings && <Nav className="flex-column">{ meetings }</Nav>}
        </div>
    );
};

export async function MeetingArray() {
    const { currentUser } = useAuth();
    let meetings = [];
    const [value, loading, error] = useDocument(
        firebase.firestore().doc(`users/${currentUser.uid}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
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
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Document: Loading...</span>}
            {meetings && <Nav className="flex-column">{ meetings }</Nav>}
        </div>
    );
};