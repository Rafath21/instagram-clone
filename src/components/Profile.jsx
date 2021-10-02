import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { firestore } from "../firebase";
import firebase from "firebase/app";
import "../css/App.css";
import Postcard from "./Postcard";
import { AuthContext } from "../AuthProvider";
import Profileloader from "../Loaders/Profileloader";
import handleFollow from "../handlers/handleFollow";

let Profile = (props) => {
  const location = useLocation();
  let value = {
    uid: location.state.uid,
  };
  let [loading, setLoading] = useState(false);
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
  console.log(followers);
  useEffect(async () => {
    setLoading(true);
    let docd = await firestore.collection("users").doc(value?.uid).get();
    let details = docd.data();
    setpfpUrl(details?.photoURL);
    setusername(details?.username);
    setBio(details?.bio);
    if (details?.followersCount != undefined) {
      setFollowersCount(details?.followersCount);
    }
    if (details?.followingCount != undefined) {
      setFollowingCount(details?.followingCount);
    }
    if (postsCount != undefined) {
      setpostsCount(details?.postsCount);
    }
    if (postsCount != undefined) {
      let docc = await firestore
        .collection("users")
        .doc(value.uid)
        .collection("posts")
        .orderBy("timestamp", "desc")
        .get();
      let arr1 = [];
      docc.forEach((doc) => {
        let obj = {};
        obj["postId"] = doc.data()?.postId;
        obj["postUrl"] = doc.data()?.postUrl;
        arr1.push(obj);
      });
      setPosts(arr1);
    }
    let followers = await firestore
      .collection("users")
      .doc(location.state?.uid)
      .collection("followers")
      .get();
    let arr2 = [];
    followers.forEach((doc) => {
      arr2.push(doc.data());
    });
    setFollowers(arr2);
    let follows = await firestore
      .collection("users")
      .doc(location.state.uid)
      .collection("following")
      .get();
    let arr3 = [];
    follows.forEach((doc) => {
      arr3.push(doc.data());
    });
    setFollows(arr3);
    let doc = await firestore.collection("users").doc(currUser.uid).get();
    setcurrPfp(doc.data().photoURL);
    setcurrUn(doc.data().username);
    setLoading(false);
  }, []);
  useEffect(async () => {
    //checking if the user's account is public or private
    let data = await firestore
      .collection("users")
      .doc(location.state.uid)
      .get();

    if (location.state?.uid == currUser?.uid) {
      setownProfile(true);
    }
    if (
      data.data()?.typeOfAccount == "public" ||
      location.state.uid == currUser.uid
    ) {
      console.log("in if");
      setrestrictedStatus(true);
    }
    let ownData = await firestore
      .collection("users")
      .doc(currUser?.uid)
      .collection("following")
      .get();
    ownData.forEach((doc) => {
      console.log(doc.data());
      if (doc.data()?.fluid == location.state?.uid) {
        setcurrUserFollow("Following");
        console.log("conditional render:", doc.data()?.fluid);
        setrestrictedStatus(true);
      }
    });
  }, []);
  async function handlefollow(e) {
    console.log("in handle follow");
    let reqDoc = await firestore.collection("users").doc(value.uid).get();
    if (reqDoc.data().typeOfAccount == "private") {
      setcurrUserFollow("Requested");
    } else {
      setcurrUserFollow("Following");
    }
    handleFollow(value.uid, username, pfpUrl, currUser.uid, currUn, currPfp);
  }
  console.log("status:", restrictedStatus);
  return (
    <>
      {loading ? (
        <Profileloader />
      ) : (
        <div className="profile-main-container">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-subheader">
                <img className="profile-pfp" src={pfpUrl} />
                <div className="profile-details">
                  <p className="profile-username">{username}</p>
                  <div className="posts-followers-following-container">
                    <p className="profile-posts-number">
                      <b>{postsCount}</b> Posts
                    </p>
                    <p
                      className="profile-followers-number"
                      onClick={() => {
                        setfollowersBoxOpen(true);
                      }}
                    >
                      <b>{followersCount}</b> Followers
                    </p>
                    <p
                      className="profile-following-number"
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
                          pathname: `/chatwindow/${username}`,
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
                        <button
                          className="profile-sendMsg"
                          onClick={() => {
                            console.log("send msg clicked");
                          }}
                        >
                          Send Message
                        </button>
                      </Link>
                      <button
                        className="follow-status"
                        onClick={(e) => {
                          if (currUserFollow != "Following") handlefollow(e);
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
                      <div className="followers-inner" key={index}>
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
                <div className="followers-container">
                  {follows.map((e, index) => {
                    return (
                      <div className="follows-inner" key={index}>
                        <img src={e.pfp} alt="" className="follows-pfp" />
                        <p className="follows-username">{e.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="profile-posts-container">
              <p className="posts-title">POSTS</p>
              <hr />
              {restrictedStatus ? (
                <div className="profile-posts">
                  {posts.map((e, index) => {
                    return (
                      <img
                        className="profile-post"
                        key={index}
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
      )}
    </>
  );
};
export default Profile;
