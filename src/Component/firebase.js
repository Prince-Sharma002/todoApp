
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDY9JJb0c0Diydim9j5TkJynxeZI6qdpE",
  authDomain: "todo-6b543.firebaseapp.com",
  projectId: "todo-6b543",
  storageBucket: "todo-6b543.appspot.com",
  messagingSenderId: "577197753464",
  appId: "1:577197753464:web:ddc87bf451b358bc70598d",
  measurementId: "G-8YMCV04CJK"
};

// Initialize Firebase Cloud Messaging and get a reference to the service
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const db = getFirestore();
export const auth = getAuth(app);

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    currentUserId = user.uid; // Set the userId when user is signed in
    console.log('User is signed in:', user);
  } else {
    // User is signed out
    console.log('User is signed out');
    currentUserId = null; // Reset userId when user is signed out
  }
});

export function getUserId() {
  return currentUserId;
}