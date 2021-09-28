import { firestore, auth } from "../firebase";
import firebase from "firebase/app";
let handleFollow=async (otherUserUid,otherUserUn,otherUserPfp,ownUid,ownUn,ownPfp) => {
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
                 let reqDoc = await firestore
                      .collection("users")
                      .doc(otherUserUid)
                      .get();                    
                    let req = "request" + ownUid;
                    if (reqDoc.data().typeOfAccount == "private") {
                      await firestore
                        .collection("users")
                        .doc(otherUserUid)
                        .collection("requests")
                        .doc(req)
                        .set({
                          name: ownUn,
                          pfp: ownPfp,
                          ruid: ownUid,
                        });
                    } else {
                      let docc = "fl" + otherUserUid;
                      let flr = "fr" + ownUid;

                      await firestore //adding the current user to suggested user's followers
                        .collection("users")
                        .doc(ownUid)
                        .collection("following")
                        .doc(otherUserUid)
                        .set({
                          name: otherUserUn,
                          fluid: otherUserUid,
                          pfp: otherUserPfp,
                        });
                      await firestore
                        .collection("users")
                        .doc(ownUid)
                        .update({
                          followingCount:
                            firebase.firestore.FieldValue.increment(1),
                        });

                      await firestore //adding the current user to suggested user's request list
                        .collection("users") //will be deleted after the user deletes it themselves
                        .doc(otherUserUid)
                        .collection("requests")
                        .doc(req)
                        .set({
                          name: ownUn,
                          pfp: ownPfp,
                          ruid: ownUid,
                        });
                      await firestore //adding the current user to suggested user's followers list
                        .collection("users")
                        .doc(otherUserUid)
                        .collection("followers")
                        .doc(ownUid)
                        .set({
                          name: ownUn,
                          pfp: ownPfp,
                          ruid: ownUid,
                        });
                      await firestore
                        .collection("users")
                        .doc(otherUserUid)
                        .update({
                          followersCount:
                            firebase.firestore.FieldValue.increment(1),
                        });
                      let getRecentDocs = await firestore
                        .collection("users")
                        .doc(otherUserUid)
                        .collection("posts")
                        .get();
                      getRecentDocs.forEach(async (doc) => {
                        await firestore
                          .collection("users")
                          .doc(ownUid)
                          .collection("feedItems")
                          .doc(ownUid + "post" + Date.now())
                          .set({
                            timestamp: timestamp,
                            feedItemurl: doc.data().postUrl,
                            postedBy: otherUserUn,
                            postedBypfp:otherUserPfp,
                            postedCaption: doc.data().caption,
                            likes: doc.data().likes,
                            comments: doc.data().comments,
                            postId: doc.data().postId,
                            postedByUid: otherUserUid,
                          });
                      });
                      let getRecentReels = await firestore
                        .collection("users")
                        .doc(otherUserUid)
                        .collection("reels")
                        .get();
                      console.log(getRecentDocs);
                      getRecentReels.forEach(async (doc) => {
                        console.log(doc.data());
                        await firestore
                          .collection("users")
                          .doc(ownUid)
                          .collection("reelsFeed")
                          .doc(ownUid + "reel" + Date.now())
                          .set({
                            timestamp: timestamp,
                            feedItemurl: doc.data().postUrl,
                            postedBy: otherUserUn,
                            postedBypfp:otherUserPfp,
                            postedCaption: doc.data().caption,
                            likes: doc.data().likes,
                            comments: doc.data().comments,
                            postId: doc.data().postId,
                            postedByUid: otherUserUid,
                          });
                      });
                    }
}
export default handleFollow;