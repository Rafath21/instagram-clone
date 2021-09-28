import { useEffect, useState } from "react";
import "../css/App.css";
import Createpost from "../handlers/Createpost";
import { firestore } from "../firebase";
import handleLikes from "../handlers/handleLikes";
import handleComments from "../handlers/handleComments";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import ReelsLoader from "../Loaders/ReelsLoader";
import "../css/reels.css";
let VideoCard = (props) => {
  let [username, setUsername] = useState("");
  let [pfpUrl, setpfpUrl] = useState("");
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let [createReelOpen, setCreateReelOpen] = useState(false);
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadCaption, setuploadCaption] = useState("");
  let [currUserComment, setcurrUserComment] = useState("");
  let [currUserLike, setCurrUserlike] = useState(false);
  let uid = props.value.uid;
  let id = Date.now();
  let [feedItem, setfeedItem] = useState("");
  let [loading, setLoading] = useState(false);
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
  useEffect(async () => {
    let details = await firestore.collection("users").doc(uid).get();
    setUsername(details.data().username);
    setpfpUrl(details.data().photoURL);
  }, []);
  console.log(props);
  useEffect(async () => {
    setLoading(true);
    setfeedItem(props.reel.feedItemurl);
    if (props.reel.likes?.includes(uid)) {
      setCurrUserlike(true);
    }
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <ReelsLoader />
      ) : (
          <div className="video-card">
            <>
              <video
                autoPlay="true"
                onClick={(e) => {
                  if (playing) {
                    setPlaying(false);
                    e.currentTarget.pause();
                  } else {
                    setPlaying(true);
                    e.currentTarget.play();
                  }
                }}
                src={feedItem}
              ></video>
              <div className="reels-actions">
                <div className="actions">
                  <div
                    className="reel-like"
                    onClick={() => {
                      if (currUserLike) setCurrUserlike(false);
                      else setCurrUserlike(true);
                      handleLikes(
                        uid,
                        props.reel.postedByUid,
                        props.reel.postId,
                        "reels",
                        "reelsFeed"
                      );
                    }}
                  >
                    {currUserLike ? (
                      <i class="fa fa-heart" id="heart-icon-like"></i>
                    ) : (
                      <i class="far fa-heart" id="heart-icon-likes"></i>
                    )}
                  </div>
                  <i
                    class="fas fa-comments"
                    id="reels-comments-icon"
                    onClick={() => {
                      if (commentboxOpen) setCommentBoxOpen(false);
                      else setCommentBoxOpen(true);
                    }}
                  ></i>
                  <i
                    class="far fa-plus-square"
                    id="create-reel"
                    onClick={(e) => {
                      setCreateReelOpen(true);
                    }}
                  ></i>
                </div>
                <h4>{props.reel.likes?.length} likes</h4>
                <div className="username-pfp-container">
                  <Link
                    to={{
                      pathname: `/profile/${props.reel.postedBy}`,
                      state: {
                        uid: props.reel.postedByUid,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <img src={props.reel.postedBypfp} />
                    <p className="username">
                      <b>{props.reel.postedBy}</b>
                    </p>
                  </Link>
                  <span>{props.reel.postedCaption}</span>
                </div>
                <p className="song">
                  <i class="fas fa-music"></i>
                  <marquee>Original Audio</marquee>
                </p>
              </div>
            </>

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
                    if (size > 15728640) {
                      alert("Sorry! The video size cannot be more than 15mb😅");
                      e.target.value = null;
                    }
                  }}
                />
                <p className="create-reel-caption-heading">
                  Write your caption here...
                </p>
                <textarea
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
                    setCreateReelOpen(false);
                    Createpost(
                      uid,
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
                  }}
                >
                  POST
                </button>
              </div>
            ) : (
              ""
            )}
            {commentboxOpen ? (
              <div className="reels-comments-container">
                <div className="reels-comments-header">
                  <i
                    class="fas fa-arrow-left"
                    onClick={() => {
                      if (commentboxOpen) setCommentBoxOpen(false);
                    }}
                  ></i>
                  <h3>Comments</h3>
                </div>
                <div className="reel-comments">
                  {props.reel.comments?.map((element) => {
                    console.log(props.reel.comments);
                    return (
                      <div className="reel-comments-inner">
                        <Link
                          to={{
                            pathname: `/profile/${element.uname}`,
                            state: {
                              uid: element?.uid,
                            },
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <img src={element.upfpUrl} />
                          <h5>{element.uname}</h5>
                        </Link>
                        <p>{element.ucomment}</p>
                      </div>
                    );
                  })}
                </div>
                <div class="reel-comment-form">
                  <textarea
                    class="user-comment"
                    onChange={(e) => {
                      setcurrUserComment(e.currentTarget.value);
                    }}
                  ></textarea>
                  <button
                    class="user-comment-post-button"
                    onClick={async () => {
                      handleComments(
                        uid,
                        props.reel.postedByUid,
                        props.reel.postId,
                        currUserComment,
                        "reels",
                        "reelsFeed",
                        username,
                        pfpUrl
                      );
                    }}
                  >
                    POST
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
      )}
    </>
  );
};
export default VideoCard;
