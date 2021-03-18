import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();

const eventsRef = firestore.collection('events');
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

function FirebaseListen() {
    const responsesRef = getEventRef('J56Kk1Q3sKK9R15Z94dt').collection('responses');
    const [responses] = useCollectionData(responsesRef, {idField: 'id'})

    //const [availability, setAvailability] = useState('');


}

// value={availability} onChange={(e) =! setAvailability(e.target.value)}