// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-qeql5liXZuxT8lPUd6zLCTOH7T666zg",
  authDomain: "data-tool-b055d.firebaseapp.com",
  projectId: "data-tool-b055d",
  storageBucket: "data-tool-b055d.appspot.com",
  messagingSenderId: "342858627088",
  appId: "1:342858627088:web:664e4ed0344a48f54f7295",
  measurementId: "G-7QRY1NV2E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, analytics };
