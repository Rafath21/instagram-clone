import firebase from "firebase/app";
import { auth, storage, firestore } from "../firebase";

let handleComments=async(currUserId,postedByUid,postId,currUserComment,collectionO,collectionf,currUsername,currPfpurl)=>{
 await firestore
                    .collection("users")
                    .doc(postedByUid)
                    .collection(collectionO)
                    .doc(postId)
                    .set(
                      {
                        comments: firebase.firestore.FieldValue.arrayUnion({
                          uname: currUsername,
                          ucomment: currUserComment,
                          upfpUrl:currPfpurl,
                          uid: currUserId,
                        }),
                      },
                      { merge: true }
                    );
                  await firestore
                    .collection("users")
                    .doc(postedByUid)
                    .collection(collectionf)
                    .doc(postId)
                    .set(
                      {
                        comments: firebase.firestore.FieldValue.arrayUnion({
                          uname: currUsername,
                          ucomment: currUserComment,
                          upfpUrl: currPfpurl,
                          uid: currUserId,
                        }),
                      },
                      { merge: true }
                    );
                  let querySnapshot = await firestore
                    .collection("users")
                    .doc(postedByUid)
                    .collection("followers")
                    .get();
                  querySnapshot.forEach(async (doc) => {
                    let update = await firestore
                      .collection("users")
                      .doc(doc.data().ruid)
                      .collection(collectionf)
                      .doc(postId)
                      .get();
                    if (update.exists) {
                      await firestore
                        .collection("users")
                        .doc(doc.data().ruid)
                        .collection(collectionf)
                        .doc(postId)
                        .set(
                          {
                            comments: firebase.firestore.FieldValue.arrayUnion({
                              uname: currUsername,
                              ucomment: currUserComment,
                              upfpUrl: currPfpurl,
                              uid: currUserId,
                            }),
                          },
                          { merge: true }
                        );
                    } else {
                      console.log("it does not exist");
                    }
                  });
                
}
export default handleComments;