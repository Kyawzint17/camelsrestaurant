// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

let app;
let analytics;
let db;
let storage;
let auth;

if (typeof window !== "undefined") {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCKHlLL9Cw41rXdyVONraxEpNl8Abimx-4",
    authDomain: "camelsrestaurant-30ee5.firebaseapp.com",
    projectId: "camelsrestaurant-30ee5",
    storageBucket: "camelsrestaurant-30ee5.appspot.com",
    messagingSenderId: "286834082066",
    appId: "1:286834082066:web:c40b2cc69ae8d2c8ee73cb",
    measurementId: "G-NRC96JM5F7"
  };

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app); 
    storage = getStorage(app);
    auth = getAuth(app); // Initialize Firebase Authentication
     // Initialize GoogleAuthProvider provider = new GoogleAuthProvider();
  } else {
    app = getApp();
    db = getFirestore(app); 
    storage = getStorage(app);
    auth = getAuth(app); // Use the already initialized Authentication
     // Use the already initialized GoogleAuthProvider provider = new GoogleAuthProvider();
  }
}

const provider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log('User Info:', user);
    return user;
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

export { db, storage, auth, signInWithGoogle };
