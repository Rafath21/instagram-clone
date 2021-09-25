import { Link } from "react-router-dom";
import "../css/App.css";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import firebase from "firebase/app";
import handleLikes from "../handlers/handleLikes";
import handleComments from "../handlers/handleComments";
let Postcard = (props) => {
  let [comments, setComments] = useState([]);
  let [likes, setLikes] = useState(0);
  let [currUserLike, setCurrUserLike] = useState(false);
  let [currUserComment, setcurrUserComment] = useState("");
  let [commentBoxOpen, setcommentBoxOpen] = useState(false);
  let currUserId = props.value?.uid;
  let [flag, setFlag] = useState(false);

  useEffect(() => {
    let f = async () => {
      setComments(props.post.comments);
      setLikes(props.post.likes?.length);
      if (props.post.likes?.includes(currUserId)) {
        setCurrUserLike(true);
      }
    };
    f();
  }, []);
  console.log(props.post.likes);
  async function handleCurrUserlike() {
    handleLikes(
      currUserId,
      props.post.postedByUid,
      props.post.postId,
      "posts",
      "feedItems"
    );
  }
  async function handleCurrUserComments() {
    handleComments(
      currUserId,
      props.post.postedByUid,
      props.post.postId,
      currUserComment,
      "posts",
      "feedItems",
      props.username,
      props.pfpUrl
    );
  }

  return (
    <div className="post-card-container">
      <div className="post-card-header">
        <img className="post-img" src={props.post.postedBypfp}></img>
        <Link
          to={{
            pathname: "/profile",
            state: {
              uid: props.post.postedByUid,
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <p className="post-username">{props.post.postedBy}</p>
        </Link>
      </div>
      <div className="post-photo">
        <img id="post-pic" src={props.post.feedItemurl} />
      </div>
      <div className="post-card-likes-comments">
        <div className="post-liking-commenting">
          <div
            className="post-like"
            onClick={async () => {
              handleCurrUserlike();
              if (currUserLike == false) setCurrUserLike(true);
              else setCurrUserLike(false);
            }}
          >
            {currUserLike ? (
              <i class="fa fa-heart" id="heart-icon-like"></i>
            ) : (
              <i class="far fa-heart" id="heart-icon-likes"></i>
            )}
          </div>
          <i
            class="far fa-comment"
            id="comment-icon"
            onClick={() => {
              setcommentBoxOpen(true);
            }}
          ></i>
        </div>
        <div className="post-likes-number">{likes} likes</div>
        <div className="post-username-and-caption-container">
          <Link
            to={{
              pathname: "/profile",
              state: {
                uid: props.post.postedByUid,
              },
            }}
            style={{ textDecoration: "none" }}
          >
            <p className="post-username-bottom">{props.post.postedBy}</p>
          </Link>

          <p className="post-caption">{props.post.postedCaption}</p>
        </div>
        {commentBoxOpen ? (
          <div class="post-comment-form-container">
            <div class="comment-form-header">
              <i
                class="fas fa-arrow-left"
                onClick={() => {
                  if (commentBoxOpen) setcommentBoxOpen(false);
                }}
              ></i>
              <p class="comment-title">Comments</p>
            </div>
            <div class="comment-form-comments">
              {comments.map((e) => {
                console.log(comments.length);
                return (
                  <div class="comment-form-inner">
                    <img class="comment-pfp" src={e.upfpUrl} />
                    <Link
                      to={{
                        pathname: "/profile",
                        state: {
                          uid: e.uid,
                        },
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <p class="comment-username">{e.uname}</p>
                    </Link>
                    <p class="post-comment">{e.ucomment}</p>
                  </div>
                );
              })}
            </div>

            <div class="comment-form">
              <textarea
                class="user-comment"
                onChange={(e) => {
                  setcurrUserComment(e.currentTarget.value);
                }}
              ></textarea>
              <button
                class="user-comment-post-button"
                onClick={async () => {
                  handleCurrUserComments();
                  let arr = [];
                  arr = [...comments];
                  arr.push({
                    uname: props.username,
                    ucomment: currUserComment,
                    upfpUrl: props.pfpUrl,
                    uid: props.value.uid,
                  });
                  setComments(arr);
                }}
              >
                POST
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div class="post-comments-container">
          {comments.length <= 2 ? (
            comments.map((e) => {
              return (
                <div class="post-comments-inner">
                  <Link
                    to={{
                      pathname: "/profile",
                      state: {
                        uid: e.uid,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <p class="comment-username">{e.uname}</p>
                  </Link>
                  <p class="post-comment">{e.ucomment}</p>
                </div>
              );
            })
          ) : (
            <>
              <p
                className="show-comments-title"
                onClick={() => {
                  console.log("show more clicked");
                  setcommentBoxOpen(true);
                }}
              >
                Show Comments
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Postcard;