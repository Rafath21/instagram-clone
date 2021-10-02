import "../css/stories.css";
import Createpost from "../handlers/Createpost";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import firebase from "firebase/app";
import { auth, storage, firestore } from "../firebase";
let Createstory = () => {
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFilesize, setuploadFilesize] = useState("");
  let [uploadFiletype, setuploadFiletype] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadFileUrl, setUploadFileurl] = useState(null);
  let [uploadCaption, setuploadCaption] = useState("");
  let location = useLocation();
  let id = Date.now();
  let atHour = new Date().getHours();
  let history = useHistory();
  let currUserId = location.state.uid;
  let currUsername = location.state.uname;
  let currUserpfp = location.state.upfp;
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created

  async function createNewStory() {
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
      //console.log(snapshot.bytesTransferred);
      //console.log(snapshot.totalBytes);
    };
    //f2 function passed to state_changed event for error handling
    let f2 = (error) => {
     // console.log(error);
    };
    let f3 = () => {
      let p = uploadPost.snapshot.ref.getDownloadURL();

      p.then((url) => {
        firestore
          .collection("users")
          .doc(currUserId)
          .collection("stories")
          .doc(currUserId)
          .set(
            {
              postedStories: firebase.firestore.FieldValue.arrayUnion({
                storyCaption: uploadCaption,
                storyImg: url,
              }),
              storyByUid: currUserId,
              storyByUn: currUsername,
              storyBypfp: currUserpfp,
              timestamp: timestamp,
            },

            { merge: true }
          );

        followers.map(async (e) => {
          await firestore
            .collection("users")
            .doc(e.ruid)
            .collection("storiesFeed")
            .doc(currUserId)
            .set(
              {
                postedStories: firebase.firestore.FieldValue.arrayUnion({
                  storyCaption: uploadCaption,
                  storyImg: url,
                }),
                storyByUid: currUserId,
                storyByUn: currUsername,
                storyBypfp: currUserpfp,
                timestamp: timestamp,
              },
              { merge: true }
            );
          //console.log("Successfully added");
        });
      });
    };

    let uploadPost = storage
      .ref(`/posts/${currUserId}/${Date.now() + uploadFilename}`)
      .put(uploadFile);

    uploadPost.on("clicked", f1, f2, f3);
    setTimeout(() => {
      //console.log("in set timeout");
      history.push("/");
    }, 5000);
  }
  return (
    <div className="create-story-container">
      <h3>Create new Story</h3>
      <div className="choose-story-file">
        <p>Choose photo..</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files[0]) return;
            setuploadFilename(e.target.files[0].name);
            setuploadFilesize(e.target.files[0].size);
            setuploadFiletype(e.target.files[0].type);
            setuploadFile(e.target.files[0]);
            uploadFiletype = uploadFiletype.split("/")[0];
            //console.log(uploadFiletype);
          }}
        />
      </div>
      <div className="story-write-caption">
        <p>Write caption:</p>
        <textarea
          onChange={(e) => {
            let caption = e.currentTarget.value;
            setuploadCaption(caption);
          }}
        ></textarea>
      </div>
      <button
        onClick={async (e) => {
          e.preventDefault();
          //console.log(e);
          e.target.innerText = "POSTED";
          createNewStory();
        }}
      >
        POST
      </button>
    </div>
  );
};
export default Createstory;
