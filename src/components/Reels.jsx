import { useState, useContext, useEffect, useRef } from "react";
import "../css/App.css";
import { firestore } from "../firebase";
import { AuthContext } from "../AuthProvider";
import VideoCard from "./VideoCard";
import ReelsLoader from "../Loaders/ReelsLoader";
import Createpost from "../handlers/Createpost";
import firebase from "firebase/app";

let Reels = () => {
  let [feedReels, setFeedReels] = useState([]);
  let [loading, setLoading] = useState(false);
  let value = useContext(AuthContext);
  let [createReelOpen, setCreateReelOpen] = useState(false);
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadCaption, setuploadCaption] = useState("");
  let captionRef = useRef();
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
  let [username, setUsername] = useState("");
  let [pfpUrl, setpfpUrl] = useState("");
  let id = Date.now();

  function captionClear() {
    captionRef.current.value = "";
  }
  useEffect(async () => {
    setLoading(true);
    let unsubscription = await firestore
      .collection("users")
      .doc(value?.uid)
      .collection("reelsFeed")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        setFeedReels(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    setLoading(false);
    return () => {
      unsubscription();
    };
  }, []);
  useEffect(async () => {
    let details = await firestore.collection("users").doc(value?.uid).get();
    setUsername(details.data().username);
    setpfpUrl(details.data().photoURL);
  }, []);
  return (
    <>
      {loading ? (
        <ReelsLoader />
      ) : (
        <div className="reels-container">
          {feedReels.length > 0 ? (
            feedReels.map((reel, index) => {
              return (
                <VideoCard
                  value={value}
                  reel={reel}
                  key={index}
                  username={username}
                  pfpUrl={pfpUrl}
                />
              );
            })
          ) : (
            <div className="no-reels-container">
              <h1>No reels! Please follow people on IC to watch reels 😍</h1>
              <button
                onClick={() => {
                  setCreateReelOpen(true);
                }}
              >
                Create Reel
              </button>
              {createReelOpen ? (
                <div className="create-reel-container">
                  <i
                    class="far fa-times-circle"
                    id="create-reel-container-close"
                    onClick={() => {
                      setCreateReelOpen(false);
                    }}
                  ></i>
                  <p className="create-reel-heading">Create New Reel</p>
                  <input
                    type="file"
                    className="create-post-input"
                    accept="video/*"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={(e) => {
                       if (!e.target.files[0]) return;
                      setuploadFilename(e.target.files[0].name);
                      let size = e.target.files[0].size;
                      setuploadFile(e.target.files[0]);
                      console.log(size);
                    if (size > 15728640) {
                      alert(
                       "Sorry! The video size cannot be more than 15mb😅"
                      );
                      e.target.value = null;
                       }
                    }}
                  />
                  <p className="create-reel-caption-heading">
                    Write your caption here...
                  </p>
                  <textarea
                    ref={captionRef}
                    type="text"
                    className="create-reel-caption"
                    onChange={(e) => {
                      let caption = e.currentTarget.value;
                      setuploadCaption(caption);
                    }}
                  ></textarea>
                  <button
                    className="create-new-reel-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.currentTarget.value = "Posting..";
                      captionClear();
                      Createpost(
                        value?.uid,
                        uploadFilename,
                        uploadCaption,
                        id,
                        username,
                        pfpUrl,
                        uploadFile,
                        "reelsFeed",
                        "reels",
                        "reel",
                        timestamp
                      );
                      setTimeout(() => {
                        setCreateReelOpen(false);
                      }, 4000);
                    }}
                  >
                    POST
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Reels;
