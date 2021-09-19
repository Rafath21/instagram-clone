import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { firestore } from "./firebase";
import "./App.css";
import Postcard from "./Postcard";
import { AuthContext } from "./AuthProvider";
let Profile = (props) => {
  const location = useLocation();
  let value = {
    uid: location.state.uid,
  };
  let currUser = useContext(AuthContext);
  let [pfpUrl, setpfpUrl] = useState("");
  let [username, setusername] = useState("");
  let [followingCount, setFollowingCount] = useState(0);
  let [followersCount, setFollowersCount] = useState(0);
  let [postsCount, setpostsCount] = useState(0);
  let [posts, setPosts] = useState([]);
  let [followsBoxOpen, setfollowsBoxOpen] = useState(false);
  let [followersBoxOpen, setfollowersBoxOpen] = useState(false);
  let [followers, setFollowers] = useState([]);
  let [follows, setFollows] = useState([]);
  let [post, setPost] = useState({
    postedCaption: "",
    comments: [],
    likes: 0,
    feedItemurl: "",
    postId: "",
    postedBy: "",
    postedBypfp: "",
    postedByUid: "",
  });
  const [modal, setModal] = useState({
    isOpen: false,
    postId: "",
  });
  console.log(value.uid);
  console.log("Location:" + location.state.uid);
  useEffect(async () => {
    let doc = await firestore.collection("users").doc(value.uid).get();
    let details = doc.data();
    setpfpUrl(details.photoURL);
    setusername(details.username);
    if (details.followersCount != undefined) {
      setFollowersCount(details.followersCount);
    }
    if (details.followingCount != undefined) {
      setFollowingCount(details.followingCount);
    }
    if (postsCount != undefined) {
      setpostsCount(details.postsCount);
    }
    if (postsCount != undefined) {
      let docc = await firestore
        .collection("users")
        .doc(value.uid)
        .collection("posts")
        .get();
      let arr = [];
      docc.forEach((doc) => {
        let obj = {};
        obj["postId"] = doc.data().postId;
        obj["postUrl"] = doc.data().postUrl;
        arr.push(obj);
      });
      setPosts(arr);
      console.log(posts);
    }
    console.log(followingCount);
  }, []);
  useEffect(async () => {
    let followers = await firestore
      .collection("users")
      .doc(location.state.uid)
      .collection("followers")
      .get();
    let arr = [];
    followers.forEach((doc) => {
      arr.push(doc.data());
    });
    setFollowers(arr);
    console.log(followers);
  }, []);
  useEffect(async () => {
    let follows = await firestore
      .collection("users")
      .doc(location.state.uid)
      .collection("following")
      .get();
    let arr = [];
    follows.forEach((doc) => {
      arr.push(doc.data());
    });
    setFollows(arr);
    console.log(follows);
  }, []);
  useEffect(() => {
    console.log(followers);
    console.log(follows);
  });
  return (
    <div class="profile-main-container">
      <div class="profile-container">
        <div class="profile-header">
          <img class="profile-pfp" src={pfpUrl} />
          <div class="profile-details">
            <p class="profile-username">{username}</p>
            <div class="posts-followers-following-container">
              <p class="profile-posts-number">
                <b>{postsCount}</b> Posts
              </p>
              <p
                class="profile-followers-number"
                onClick={() => {
                  setfollowersBoxOpen(true);
                }}
              >
                <b>{followersCount}</b> Followers
              </p>
              <p
                class="profile-following-number"
                onClick={() => {
                  setfollowsBoxOpen(true);
                }}
              >
                <b>{followingCount}</b> Following
              </p>
            </div>
          </div>
          <Link
            to={{
              pathname: "/chatwindow",
              state: {
                senderUid: value.uid,
                senderPfp:pfpUrl,
                senderUn:username
              },
            }}
            style={{ textDecoration: "none" }}
          >
            <button className="profile-sendMsg">Send Message</button>
          </Link>
        </div>
        {followersBoxOpen ? (
          <div className="followers-box-container">
            <div className="followers-box-header">
              <i
                class="fas fa-arrow-left"
                id="followers-back"
                onClick={() => {
                  setfollowersBoxOpen(false);
                }}
              ></i>
              <p className="followers-heading">Followers</p>
              <hr></hr>
            </div>
            <div className="followers-container">
              {followers.map((e, index) => {
                return (
                  <div className="followers-inner">
                    <img src={e.pfp} alt="" className="followers-pfp" />
                    <p className="follower-username">{e.name}</p>
                    <hr></hr>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        {followsBoxOpen ? (
          <div className="follows-box-container">
            <div className="follows-box-header">
              <i
                id="follows-back"
                class="fas fa-arrow-left"
                onClick={() => {
                  setfollowsBoxOpen(false);
                }}
              ></i>
              <p className="follows-heading">Following</p>
              <hr></hr>
            </div>
            {follows.map((e, index) => {
              return (
                <div className="follows-inner">
                  <img src={e.pfp} alt="" className="follows-pfp" />
                  <p className="follows-username">{e.name}</p>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <div class="profile-posts-container">
          <p class="posts-title">POSTS</p>
          <hr />
          <div class="profile-posts">
            {posts.map((e) => {
              return (
                <img
                  class="profile-post"
                  src={e.postUrl}
                  onClick={async () => {
                    setModal({
                      isOpen: true,
                      postId: e.postId,
                    });
                    let doc = await firestore
                      .collection("users")
                      .doc(value.uid)
                      .collection("posts")
                      .doc(e.postId)
                      .get();
                    console.log(doc.data());
                    let obj = {};
                    obj["postedCaption"] = doc.data().caption;
                    obj["comments"] = doc.data().comments;
                    obj["likes"] = doc.data().likes;
                    obj["feedItemurl"] = doc.data().postUrl;
                    obj["postId"] = e.postId;
                    obj["postedBy"] = username;
                    obj["postedBypfp"] = pfpUrl;
                    setPost({
                      ...post,

                      postedCaption: doc.data().caption,
                      comments: doc.data().comments,
                      likes: doc.data().likes,
                      feedItemurl: doc.data().postUrl,
                      postId: e.postId,
                      postedBy: username,
                      postedBypfp: pfpUrl,
                      postedByUid: value.uid,
                    });
                    console.log(post);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      {modal.isOpen && (
        <div className="main-post-card-container">
          <i
            class="fas fa-arrow-left"
            id="back-btn"
            onClick={() => {
              if (modal.isOpen) setModal({ isOpen: false });
            }}
          ></i>
          <Postcard
            post={post}
            username={username}
            pfpUrl={pfpUrl}
            value={value}
          />
        </div>
      )}
    </div>
  );
};
export default Profile;
/*<Showpost
            postId={modal.postId}
            uid={uid}
            close={() => setModal({ isOpen: false, postId: "" })}
          />*/
