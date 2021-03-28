import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import history from "../history";

const auth = firebase.auth();
const firestore = firebase.firestore();

const meetingsRef = firestore.collection('meetings');
const usersRef = firestore.collection('users');

function getEventRef(id) {
    return firestore.collection('events').doc(id);
}

const updateDatabase = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    //TODO: add to specific event
    await eventsRef.add({
        name: "Bob",
        availability: [[1,1,0],[0,0,1]],
        group: "Student Group"
    })

    //setAvailability();
}

/***
 * Returns true if meeting exists in database, false otherwise
 * @param code
 * @returns {*}
 */
function meetingExists(code){
    var docRef = meetingsRef.doc(code);
    const doc = docRef.get();
    return doc.exists;
}

/***
 * Return a all into for a given meeting
 * @param code
 */
export function getMeetingInfo(code){
    var docRef = meetingsRef.doc(code);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const meetingInfo = doc.data()
            console.log("Document data:", meetingInfo);
            return meetingInfo;
        } else {
            // doc.data() will be undefined in this case
            alert("meeting code not found");
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

export function fixTable(oneDtable,cols){
    var twoDTable = [];
    var row;
    while(oneDtable.length > 0){
        row = oneDtable.splice(0,cols);
        twoDTable.push(row);
    }

    return twoDTable;
}

export function fixDays(days){
    var fixed = [];
    days.forEach(day => fixed.push(new Date(day.seconds * 1000)));
    return fixed;
}


function FirebaseListen() {
    const responsesRef = getEventRef('J56Kk1Q3sKK9R15Z94dt').collection('responses');
    const [responses] = useCollectionData(responsesRef, {idField: 'id'})

    //const [availability, setAvailability] = useState('');


}

// value={availability} onChange={(e) =! setAvailability(e.target.value)}
