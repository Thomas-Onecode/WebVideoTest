import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions';
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQ6MvZkeS4VLniW6xHww13rdsc8xK-_-g",
    authDomain: "webvideol-sning.firebaseapp.com",
    projectId: "webvideol-sning",
    storageBucket: "webvideol-sning.appspot.com",
    messagingSenderId: "871256398680",
    appId: "1:871256398680:web:9fe315e2e7d5742a29232d",
    measurementId: "G-9CS00N6TF5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence);

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase functions and get a reference to the service
const fun = getFunctions(app, "europe-west4");

// Initialize Firebase storage and get a reference to the service
const storage = getStorage(app)

export { auth, db, fun, storage }