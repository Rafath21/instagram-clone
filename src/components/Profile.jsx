import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { firestore } from "../firebase";
import firebase from "firebase/app";
import "../css/App.css";
import Postcard from "./Postcard";
import { AuthContext } from "../AuthProvider";
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
  let [currUn, setcurrUn] = useState("");
  let [currPfp, setcurrPfp] = useState("");
  let [ownProfile, setownProfile] = useState(false);
  let [bio, setBio] = useState("");
  let [currUserFollow, setcurrUserFollow] = useState("Follow");
  let [restrictedStatus, setrestrictedStatus] = useState(false); //if the current user follows the user whose profile they're viewing
  let [post, setPost] = useState({
    postedCaption: "",
    comments: [],
    likes: [],
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
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
  console.log(value.uid);
  useEffect(async () => {
    let doc = await firestore.collection("users").doc(value.uid).get();
    let details = doc.data();
    setpfpUrl(details.photoURL);
    setusername(details.username);
    setBio(details.bio);
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
        .orderBy("timestamp", "desc")
        .get();
      let arr = [];
      docc.forEach((doc) => {
        let obj = {};
        obj["postId"] = doc.data().postId;
        obj["postUrl"] = doc.data().postUrl;
        arr.push(obj);
      });
      setPosts(arr);
    }
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
  }, []);
  useEffect(async () => {
    let doc = await firestore.collection("users").doc(currUser.uid).get();
    setcurrPfp(doc.data().photoURL);
    setcurrUn(doc.data().username);
  }, []);
  useEffect(async () => {
    //checking if the user's account is public or private
    let data = await firestore
      .collection("users")
      .doc(location.state.uid)
      .get();

    if (location.state.uid == currUser.uid) {
      setownProfile(true);
    }
    if (
      data.data().typeOfAccount == "public" ||
      location.state.uid == currUser.uid
    ) {
      console.log("in if");
      setrestrictedStatus(true);
    } else {
      let ownData = await firestore
        .collection("users")
        .doc(currUser.uid)
        .collection("following")
        .get();
      ownData.forEach((doc) => {
        if (doc.data().fluid == location.state.uid) {
          setcurrUserFollow("Following");
          console.log("conditional render:", doc.data().fluid);
          setrestrictedStatus(true);
        }
      });
    }
  }, []);
  async function handleFollow(e) {
    let reqDoc = await firestore.collection("users").doc(value.uid).get();
    let req = "request" + currUser.uid;
    if (reqDoc.data().typeOfAccount == "private") {
      setcurrUserFollow("Requested");
      await firestore
        .collection("users")
        .doc(value.uid)
        .collection("requests")
        .doc(req)
        .set({
          name: currUn,
          pfp: currPfp,
          ruid: currUser.uid,
        });
    } else {
      let docc = "fl" + value.uid;
      let flr = "fr" + currUser.uid;
      setcurrUserFollow("Following");

      await firestore //adding the current user to suggested user's followers
        .collection("users")
        .doc(currUser.uid)
        .collection("following")
        .doc(value.uid)
        .set({
          name: username,
          fluid: value.uid,
          pfp: pfpUrl,
        });
      await firestore
        .collection("users")
        .doc(currUser.uid)
        .update({
          followingCount: firebase.firestore.FieldValue.increment(1),
        });

      await firestore //adding the current user to suggested user's request list
        .collection("users") //will be deleted after the user deletes it themselves
        .doc(value.uid)
        .collection("requests")
        .doc(req)
        .set({
          name: currUn,
          pfp: currPfp,
          ruid: currUser.uid,
        });
      await firestore //adding the current user to suggested user's followers list
        .collection("users")
        .doc(value.uid)
        .collection("followers")
        .doc(currUser.uid)
        .set({
          name: currUn,
          pfp: currPfp,
          ruid: currUser.uid,
        });
      await firestore
        .collection("users")
        .doc(value.uid)
        .update({
          followersCount: firebase.firestore.FieldValue.increment(1),
        });
      let getRecentDocs = await firestore
        .collection("users")
        .doc(value.uid)
        .collection("posts")
        .get();
      console.log(getRecentDocs);
      getRecentDocs.forEach(async (doc) => {
        console.log(doc.data());
        await firestore
          .collection("users")
          .doc(currUser.uid)
          .collection("feedItems")
          .doc(currUser.uid + "post" + Date.now())
          .set({
            timestamp: timestamp,
            feedItemurl: doc.data().postUrl,
            postedBy: username,
            postedBypfp: pfpUrl,
            postedCaption: doc.data().caption,
            likes: doc.data().likes,
            comments: doc.data().comments,
            postId: doc.data().postId,
            postedByUid: value.uid,
          });
      });
    }
  }
  console.log("status:", restrictedStatus);
  return (
    <div class="profile-main-container">
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-subheader">
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
              {ownProfile ? (
                <Link to={{ pathname: "/setup" }}>
                  <div className="edit-profile-btn">Edit profile</div>
                </Link>
              ) : (
                <div className="two-btns">
                  <Link
                    to={{
                      pathname: "/chatwindow",
                      state: {
                        senderUid: value.uid,
                        senderPfp: pfpUrl,
                        senderUn: username,
                        ownUid: currUser.uid,
                        ownUsername: currUn,
                        ownpfp: currPfp,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <button className="profile-sendMsg">Send Message</button>
                  </Link>
                  <button
                    className="follow-status"
                    onClick={(e) => {
                      handleFollow(e);
                    }}
                  >
                    {currUserFollow}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-bio">{bio}</div>
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
          {restrictedStatus ? (
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
          ) : (
            <div className="acc-is-private">This Account is private</div>
          )}
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
