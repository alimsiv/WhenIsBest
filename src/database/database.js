import firebase from 'firebase/app';
//import firebase from '../apis/firebase';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


//const auth = firebase.auth();
//const firestore = firebase.firestore();

//const meetingsRef = firestore.collection('meetings');
//const usersRef = firestore.collection('users');

/*
function getEventRef(id) {
    return firestore.collection('events').doc(id);
}
 */

/*
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
*/

/***
 * Returns true if meeting exists in database, false otherwise
 * @param code
 * @returns {*}
 */
/*
function meetingExists(code){
    var docRef = meetingsRef.doc(code);
    const doc = docRef.get();
    return doc.exists;
}
*/
/***
 * Return a all into for a given meeting
 * @param code
 */
export async function getMeetingInfo(code){
    //const docRef = meetingsRef.doc(code);
    const db = firebase.firestore();
    var docRef = db.collection("meetings").doc(code);
    const doc = await docRef.get();
    console.log(doc.data());
    if (doc.exists) {
        const meetingInfo = doc.data()
        console.log("Document data:", meetingInfo);
        return meetingInfo;
    } else {
        // doc.data() will be undefined in this case
        alert("meeting code not found");
        console.log("No such document!");
    }
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

/*
function FirebaseListen() {
    const responsesRef = getEventRef('J56Kk1Q3sKK9R15Z94dt').collection('responses');
    const [responses] = useCollectionData(responsesRef, {idField: 'id'})

    //const [availability, setAvailability] = useState('');
}
 */

// value={availability} onChange={(e) =! setAvailability(e.target.value)}
