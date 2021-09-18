import "./App.css";
import { firestore } from "./firebase";

let Showpost = async (props) => {
  let postId = props.postId;
  console.log(postId);
  let singlePost = await firestore
    .collection("users")
    .doc(props.uid)
    .collection("posts")
    .doc(postId)
    .get();
  console.log(singlePost.data());
  let allComments = singlePost.data().comments;
  console.log("i'm here");
  return (
    <>
      <div className="close" onClick={() => props.close()}>
        X
      </div>
      <div className="post-card-container"></div>
    </>
  );
};
export default Showpost;
/*
<div className="main-post-card-container">
      <div className="post-card-container"></div>
      <div class="post-comment-form-container">
        <div class="comment-form-header">
          <i class="fas fa-arrow-left"></i>
          <p class="comment-title">Comments</p>
        </div>
        <div class="comment-form-comments">
          {allComments.map((e) => {
            console.log(allComments.length);
            return (
              <div class="comment-form-inner">
                <img class="comment-pfp" src={e.upfpUrl} />
                <p class="comment-username">{e.uname}</p>
                <p class="post-comment">{e.ucomment}</p>
              </div>
            );
          })}
        </div>
        <div class="comment-form">
          <textarea class="user-comment">My comment is here</textarea>
        </div>
      </div>
    </div>
*/
  /*useEffect(async () => {
    if (currUserLike) {
      await firestore
        .collection("users")
        .doc(props.post.postedByUid)
        .collection("posts")
        .doc(props.post.postId)
        .update({
          likes: firebase.firestore.FieldValue.increment(1),
        });
      let querySnapshot = await firestore
        .collection("users")
        .doc(props.post.postedByUid)
        .collection("followers")
        .get();
      querySnapshot.forEach(async (doc) => {
        let update = await firestore
          .collection("users")
          .doc(doc.data().ruid)
          .collection("feedItems")
          .doc(props.post.postId)
          .get();
        if (update.exists) {
          await firestore
            .collection("users")
            .doc(doc.data().ruid)
            .collection("feedItems")
            .doc(props.post.postId)
            .update({
              likes: firebase.firestore.FieldValue.increment(1),
            });
        }
      });
    } else {
      console.log("decrementing");
      await firestore
        .collection("users")
        .doc(props.post.postedByUid)
        .collection("posts")
        .doc(props.post.postId)
        .update({
          likes: firebase.firestore.FieldValue.increment(-1),
        });
      let querySnapshot = await firestore
        .collection("users")
        .doc(props.post.postedByUid)
        .collection("followers")
        .get();
      querySnapshot.forEach(async (doc) => {
        let update = await firestore
          .collection("users")
          .doc(doc.data().ruid)
          .collection("feedItems")
          .doc(props.post.postId)
          .get();
        if (update.exists) {
          await firestore
            .collection("users")
            .doc(doc.data().ruid)
            .collection("feedItems")
            .doc(props.post.postId)
            .update({
              likes: firebase.firestore.FieldValue.increment(-1),
            });
        }
      });
    }
  }, []);*/
