import { useEffect, useState } from "react";
import "./App.css";
import Createpost from "./Createpost";
import { firestore } from "./firebase";
import handleLikes from "./handleLikes";
import handleComments from "./handleComments";
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
  let atHour = new Date().getHours();
  useEffect(async () => {
    let details = await firestore.collection("users").doc(uid).get();
    setUsername(details.data().username);
    setpfpUrl(details.data().photoURL);
  }, []);
  useEffect(async () => {
    let unsubscription = await firestore
      .collection("users")
      .doc(uid)
      .collection("reelsFeed")
      .onSnapshot((querySnapshot) => {
        setFeedReels(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    return () => {
      unsubscription();
    };
  }, []);
  console.log(feedReels);
  return (
    <div className="main-video-container">
      {feedReels.map((e) => {
        return (
          <div
            className="video-card"
            onMouseOver={() => {
              if (e.likes.includes(uid)) {
                setCurrUserlike(true);
              }
            }}
          >
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
                src={e.feedItemurl}
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
                        e.postedByUid,
                        e.postId,
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
                <h4>{e.likes?.length} likes</h4>
                <div className="username-pfp-container">
                  <img src={e.postedBypfp} />
                  <p className="username">
                    <b>{e.postedBy}</b>
                  </p>
                </div>
                <p className="song">
                  <i class="fas fa-music"></i>
                  <marquee>Original Audio</marquee>
                </p>
                <span>{e.postedCaption}</span>
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
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) => {
                    if (!e.target.files[0]) return;
                    setuploadFilename(e.target.files[0].name);
                    setuploadFilesize(e.target.files[0].size);
                    setuploadFiletype(e.target.files[0].type);
                    setuploadFile(e.target.files[0]);
                    console.log(uploadFiletype);
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
                      atHour
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
                  {e.comments?.map((element) => {
                    return (
                      <div className="reel-comments-inner">
                        <img src={element.upfpUrl} />
                        <h5>{element.uname}</h5>
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
                        e.postedByUid,
                        e.postId,
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
        );
      })}
    </div>
  );
};
export default VideoCard;
