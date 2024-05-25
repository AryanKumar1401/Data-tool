// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3jZl9LEAx1RTQpQm3-aBm3dm0PS8wjqI",
  authDomain: "data-tool-6c41e.firebaseapp.com",
  projectId: "data-tool-6c41e",
  storageBucket: "data-tool-6c41e.appspot.com",
  messagingSenderId: "154314463481",
  appId: "1:154314463481:web:c52e6869fd23bf0859aa28",
  measurementId: "G-1RDF2SWDSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, provider, analytics, db, storage };
