import { firestore } from "../firebase";
import firebase from "firebase/app";
import { useState } from "react";
const handleLikes=async(currUserId,postedByUid,postId,collectionO,collectionf)=>{
 let postDocRef = firestore
      .collection("users")
      .doc(postedByUid)
      .collection(collectionO)
      .doc(postId);
    perform(postDocRef,currUserId);
let ownDocRef = firestore
        .collection("users")
        .doc(postedByUid)
        .collection(collectionf)
        .doc(postId);
      perform(ownDocRef,currUserId);
    
    let querySnapshot = await firestore
      .collection("users")
      .doc(postedByUid)
      .collection("followers")
      .get();
    querySnapshot.forEach(async (doc) => {
      let feedItemDocRef = firestore
        .collection("users")
        .doc(doc.data().ruid)
        .collection(collectionf)
        .doc(postId);
      perform(feedItemDocRef,currUserId);
    });
}
async function perform(mainDocRef,currUserId) {
    let arr = await mainDocRef.get();
    let check=arr.data();
    if (arr.exists) {
      arr = arr.data().likes;
      if (arr.length >= 0 && !arr.includes(currUserId)) {
          console.log("it doesn't include curr user id so adding");
        await mainDocRef.update(
          {
            likes: firebase.firestore.FieldValue.arrayUnion(currUserId),
          },
          { merge: true }
        );
      } else {
        console.log(mainDocRef+"in else");
        await mainDocRef.update(
          {
            likes: firebase.firestore.FieldValue.arrayRemove(currUserId),
          },
          { merge: true }
        );
      }
    }
    else{
      console.log(check);
        console.log("it does not exist");
    }
  }
  
 /* function tempIncrement() {
    let temp = props.post.likes?.length;
    temp = temp + 1;
    setLikes(temp);
  }
  function tempDecrement() {
    let temp = props.post.likes?.length;
    temp = temp - 1;
    setLikes(temp);
  }*/

export default handleLikes;