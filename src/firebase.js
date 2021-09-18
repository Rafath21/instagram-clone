import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
var firebaseConfig = {

    apiKey: "AIzaSyCj-55e0qjdfAs6E3-RBd7cI94644XqcZo",

    authDomain: "instagram-clone-dfad6.firebaseapp.com",

    projectId: "instagram-clone-dfad6",

    storageBucket: "instagram-clone-dfad6.appspot.com",

    messagingSenderId: "926886933918",

    appId: "1:926886933918:web:22317863c37efc0b97128f",

    measurementId: "G-PY1G5C42R4"
  };

firebase.initializeApp(firebaseConfig);
export const firestore=firebase.firestore();
export const auth=firebase.auth();
export const storage=firebase.storage();


let provider=new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle=()=>auth.signInWithPopup(provider);
export default firebase;
