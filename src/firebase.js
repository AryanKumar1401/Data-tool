// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const storage = getStorage(app);


export default storage;
export { auth, provider, analytics, storage };
