import { useEffect, useState } from "react";
import "../css/App.css";
import Createpost from "../handlers/Createpost";
import { firestore } from "../firebase";
import handleLikes from "../handlers/handleLikes";
import handleComments from "../handlers/handleComments";
import { Link } from "react-router-dom";
import firebase from "firebase/app";

import "../css/reels.css";
let VideoCard = (props) => {
  let [username, setUsername] = useState("");
  let [pfpUrl, setpfpUrl] = useState("");
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let [createReelOpen, setCreateReelOpen] = useState(false);
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFilesize, setuploadFilesize] = useState("");
  let [uploadFiletype, setuploadFiletype] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadFileUrl, setUploadFileurl] = useState(null);
  let [uploadCaption, setuploadCaption] = useState("");
  let [feedReels, setFeedReels] = useState([]);
  let [audio, setAudio] = useState("");
  let [currUserComment, setcurrUserComment] = useState("");
  let [currUserLike, setCurrUserlike] = useState(false);
  let uid = props.value.uid;
  let id = Date.now();
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
  useEffect(async () => {
    let details = await firestore.collection("users").doc(uid).get();
    setUsername(details.data().username);
    setpfpUrl(details.data().photoURL);
  }, []);
  console.log(props);
  useEffect(async () => {
    if (props.reel.likes?.includes(uid)) {
      setCurrUserlike(true);
    }
  }, []);
  /*
  comments: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
feedItemurl: "https://firebasestorage.googleapis.com/v0/b/instagram-clone-dfad6.appspot.com/o/posts%2FcjBlh3I4CPQBGz0jyIe97AkQBeq1%2F1632404749874large.mp4?alt=media&token=8be54846-56d9-4514-849a-eb596dde6039"
hour: 19
likes: ['cjBlh3I4CPQBGz0jyIe97AkQBeq1']
postId: "cjBlh3I4CPQBGz0jyIe97AkQBeq1reel1632404745830"
postedBy: "max_mills"
postedByUid: "cjBlh3I4CPQBGz0jyIe97AkQBeq1"
postedBypfp: "https://firebasestorage.googleapis.com/v0/b/instagram-clone-dfad6.appspot.com/o/pfps%2FcjBlh3I4CPQBGz0jyIe97AkQBeq1%2F1629888483964photo-1579952363873-27f3bade9f55.jpg?alt=media&token=6ab8c5f8-83f5-4129-9c08-97abf3b632b7"
postedCaption: "New Video"*/
  return (
    <div className="main-video-container">
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
            src={props.reel.feedItemurl}
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
                  pathname: "/profile",
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
                setuploadFilesize(e.target.files[0].size);
                setuploadFiletype(e.target.files[0].type);
                setuploadFile(e.target.files[0]);
                console.log(uploadFilename + " " + uploadFilesize);
                /* if (uploadFilesize > 15728640) {
                  alert("Sorry! The video size cannot be more than 15mb😅");
                  e.target.value = null;
                }*/
                /*if (uploadFiletype.split("/")[0] !== "video") {
                setuploadFile("");
                setCreateReelOpen(false);
                alert("Please upload a video");
              } else if (uploadFilesize / 1000000 > 10) {
                alert("File is too big");
                setuploadFile("");
                setCreateReelOpen(false);
              }*/
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
                        pathname: "/profile",
                        state: {
                          uid: element.uid,
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
    </div>
  );
};
export default VideoCard;
