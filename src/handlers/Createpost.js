import { auth, storage, firestore } from "../firebase";
import firebase from "firebase/app";
let Createpost=async(currUserId,filename,caption,id,userName,pfpUrl,uploadFile,collectionf,collectionO,docname,atHour)=>{
                    await firestore
                    .collection("users")
                    .doc(currUserId)
                    .collection(collectionO)
                    .doc(currUserId + docname + id)
                    .set({
                      caption: caption,
                    });
                  let followers = []; //followers of the current follower
                  let querySnapshotfr = await firestore
                    .collection("users")
                    .doc(currUserId)
                    .collection("followers")
                    .get();
                  querySnapshotfr.forEach((doc) => {
                    followers.push(doc.data());
                  });
                  let f1 = (snapshot) => {
                    console.log(snapshot.bytesTransferred);
                    console.log(snapshot.totalBytes);
                  };
                  //f2 function passed to state_changed event for error handling
                  let f2 = (error) => {
                    console.log(error);
                  };
                  let f3 = () => {
                    let p = uploadPost.snapshot.ref.getDownloadURL();

                    p.then((url) => {
                      firestore
                        .collection("users")
                        .doc(currUserId)
                        .collection(collectionO)
                        .doc(currUserId + docname + id)
                        .update({
                          hour: atHour,
                          postUrl: url,
                          comments: [],
                          likes: [],
                          postId: currUserId + docname + id,
                        });
                      //setUploadFileurl(url);
                      console.log(url);
                      firestore
                        .collection("users")
                        .doc(currUserId)
                        .collection(collectionf)
                        .doc(currUserId + docname + id)
                        .set({
                          hour: atHour,
                          feedItemurl: url,
                          postedBy: userName,
                          postedBypfp: pfpUrl,
                          postedCaption: caption,
                          likes: [],
                          comments: [],
                          postId: currUserId + docname + id,
                          postedByUid: currUserId,
                        });
                      followers.map(async (e) => {
                        await firestore
                          .collection("users")
                          .doc(e.ruid)
                          .collection(collectionf)
                          .doc(currUserId + docname + id)
                          .set({
                            hour: atHour,
                            feedItemurl: url,
                            postedBy: userName,
                            postedBypfp: pfpUrl,
                            postedCaption: caption,
                            likes: [],
                            comments: [],
                            postId: currUserId + docname + id,
                            postedByUid: currUserId,
                          });
                        console.log("Successfully added");
                      });
                    });
                  };
                  await firestore
                    .collection("users")
                    .doc(currUserId)
                    .update({
                      postsCount: firebase.firestore.FieldValue.increment(1),
                    });

                  let uploadPost = storage
                    .ref(`/posts/${currUserId}/${Date.now() + filename}`)
                    .put(uploadFile);

                  uploadPost.on("clicked", f1, f2, f3);
}
export default Createpost;