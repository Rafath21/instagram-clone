import { auth, storage, firestore } from "../firebase";
import firebase from "firebase/app";
import { Redirect } from "react-router-dom";
import "../css/App.css";
import Suggestions from "./Suggestions";
import { AuthContext } from "../AuthProvider";
import { useEffect, useContext, useState } from "react";
import Postcard from "./Postcard";
import { Link, useHistory } from "react-router-dom";
import "../css/Responsive.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Createpost from "../handlers/Createpost";
import HomeLoader from "../Loaders/HomeLoader";
let Home = (props) => {
  let [userName, setUserName] = useState("");
  let [pfpUrl, setpfpUrl] = useState("");
  let [reqOpen, setreqOpen] = useState(false);
  let [createBoxOpen, setcreateBoxOpen] = useState(false);
  let [allRequests, setRequests] = useState([]);
  let [typeOfAccount, settypeOfAccount] = useState("");
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadCaption, setuploadCaption] = useState("");
  let [feedPosts, setfeedPosts] = useState([]);
  let [searchValue, setsearchValue] = useState("");
  let [notificationCount, setnotificationCount] = useState("");
  let history = useHistory();
  let [storiesArr, setStoriesArr] = useState([]);
  let [messagesCount, setmessagesCount] = useState(0);
  let [suggestionsOpen, setSuggestionsOpen] = useState(false);
  let [searchSuggOpen, setSearchSuggOpen] = useState(false);
  let [searchSugg, setSearchSugg] = useState([]);
  let [searchUid, setsearchUid] = useState(null);
  let [loading, setLoading] = useState(true);
  let [ownStories, setOwnStories] = useState([]);
  let [allUsers, setallUsers] = useState([
    {
      uid: "",
      username: "",
      pfpUrl: "",
    },
  ]);
  let settings = {
    //infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: storiesArr.length > 6 ? 6 : storiesArr.length,
    //slidesToScroll: 3,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: storiesArr.length > 4 ? 4 : storiesArr.length,
          arrows: false,

          //slidesToScroll: 2,
          //infinite: true,
          cssEase: "linear",
        },
      },
    ],
  };
  let id = Date.now();
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created
  let value = useContext(AuthContext);
  useEffect(async () => {
    let document = await firestore.collection("users").doc(value?.uid).get();
    let creds = document.data();
    settypeOfAccount(creds.typeOfAccount);
    setUserName(creds.username);
    setpfpUrl(creds.photoURL);
  }, []);
  useEffect(async () => {
    let unsubscriptionStories = await firestore
      .collection("users")
      .doc(value?.uid)
      .collection("storiesFeed")
      .onSnapshot((querySnapshot) => {
        setStoriesArr(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    let unsubscriptionOwnstories = await firestore
      .collection("users")
      .doc(value?.uid)
      .collection("stories")
      .onSnapshot((querySnapshot) => {
        setOwnStories(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    let unsubscriptionReqs = firestore
      .collection("users")
      .doc(value?.uid)
      .collection("requests")
      .onSnapshot((querySnapshot) => {
        setRequests(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
        setnotificationCount(querySnapshot.docs.length);
      });
    let unsubscriptionChats = firestore
      .collection("users")
      .doc(value?.uid)
      .collection("chats")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setmessagesCount(querySnapshot.docs.length);
      });
    let unsubscriptionFeed = await firestore
      .collection("users")
      .doc(value?.uid)
      .collection("feedItems")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        setfeedPosts(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    setLoading(false);
    return () => {
      unsubscriptionStories();
      unsubscriptionChats();
      unsubscriptionFeed();
      unsubscriptionReqs();
      unsubscriptionOwnstories();
    };
  }, []);
  useEffect(async () => {
    let users = await firestore.collection("users").get();
    let arr = [];
    let obj = {};
    users.forEach((doc) => {
      obj = {
        uid: doc.data().uid,
        username: doc.data().username,
        pfpUrl: doc.data().photoURL,
      };
      arr.push(obj);
    });
    setallUsers(arr);
  }, []);
  return (
    <>
      {loading ? (
        <HomeLoader />
      ) : (
        <div className="home-container">
          {value ? "" : <Redirect to="/register" />}
          <div className="home-header">
            <Link id="link" to="/home">
              <div className="home-header-title">Instagram-clone</div>
            </Link>
            <div className="header-search-box">
              <input
                className="header-search-input"
                type="text"
                placeholder="Who are you looking for?"
                onChange={(e) => {
                  if (e.target.value.length == 0) setSearchSuggOpen(false);
                  else setSearchSuggOpen(true);
                  setsearchValue(e.target.value);
                  setSearchSugg(
                    allUsers.filter((obj) => {
                      return obj.username
                        .toLowerCase()
                        .includes(searchValue.toLowerCase());
                    })
                  );
                }}
              />

              <i class="fas fa-search" id="search-icon"></i>
              {searchSuggOpen ? (
                <div className="search-suggestions">
                  {searchSugg.map((suggestion) => {
                    return (
                      <>
                        <Link
                          id="link"
                          to={{
                            pathname: `/profile/${suggestion.username}`,
                            state: { uid: suggestion.uid },
                          }}
                        >
                          <div className="search-suggestion">
                            <img src={suggestion.pfpUrl} />
                            <p>{suggestion.username}</p>
                          </div>
                        </Link>
                      </>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
              <i
                class="fas fa-comments"
                id="suggestions-icon"
                onClick={() => {
                  setSuggestionsOpen(true);
                }}
              >
                Suggestions
              </i>
            </div>
            <div className="other-icons">
              <i
                class="far fa-plus-square"
                id="plus-icon"
                title="Create post"
                onClick={() => {
                  if (createBoxOpen) setcreateBoxOpen(false);
                  else setcreateBoxOpen(true);
                }}
              ></i>
              {createBoxOpen ? (
                <div className="create-post-container">
                  <i
                    class="far fa-times-circle"
                    id="create-post-container-close"
                    onClick={() => {
                      setcreateBoxOpen(false);
                    }}
                  ></i>
                  <p className="create-post-heading">Create New Post</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="create-post-input"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={(e) => {
                      if (!e.target.files[0]) return;
                      setuploadFilename(e.target.files[0].name);
                      console.log("checking");
                      setuploadFile(e.target.files[0]);
                    }}
                  />
                  <p className="create-post-caption-heading">
                    Write your caption here...
                  </p>
                  <textarea
                    type="text"
                    className="create-post-caption"
                    onChange={(e) => {
                      let caption = e.currentTarget.value;
                      setuploadCaption(caption);
                    }}
                  ></textarea>
                  <button
                    className="create-new-post-btn"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.target.innerText = "POSTED";
                      setcreateBoxOpen(false);
                      Createpost(
                        value?.uid,
                        uploadFilename,
                        uploadCaption,
                        id,
                        userName,
                        pfpUrl,
                        uploadFile,
                        "feedItems",
                        "posts",
                        "post",
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
              <Link id="link" to={{ pathname: "/home" }}>
                <i class="fas fa-home" title="Home" id="home-icon"></i>
              </Link>
              <Link
                className="link"
                to={{
                  pathname: "/reels",
                  state: {
                    uid: value ? value?.uid : "",
                  },
                }}
                style={{ textDecoration: "none" }}
              >
                <i class="fas fa-video" id="reels-icon" title="reels"></i>
              </Link>
              <i
                class="fas fa-bell"
                id="requests-icon"
                title="Notifications"
                onClick={() => {
                  if (reqOpen) setreqOpen(false);
                  else setreqOpen(true);
                }}
              ></i>
              <span className="notifications">{notificationCount}</span>

              <Link
                className="link"
                to={{
                  pathname: "/chats",
                  state: {
                    uid: value ? value?.uid : "",
                    username: userName,
                    pfpUrl: pfpUrl,
                  },
                }}
                style={{ textDecoration: "none" }}
              >
                <i
                  class="fas fa-paper-plane"
                  id="paper-plane"
                  title="Messages"
                ></i>
              </Link>
              <span className="messages">{messagesCount}</span>
            </div>
          </div>

          {reqOpen ? (
            <div className="requests-container">
              {typeOfAccount == "private" ? (
                <>
                  <div className="requests-heading">Follow Requests</div>
                  <i
                    class="fas fa-window-close"
                    id="request-close-btn"
                    onClick={() => {
                      setreqOpen(false);
                    }}
                  ></i>

                  <div className="requests">
                    {allRequests.map((request, index) => {
                      return (
                        <div key={index} className="requests-inner">
                          <img className="request-pfp" src={request.pfp} />
                          <p className="request-username">
                            {request.name} wants to follow you
                          </p>

                          <button
                            className="request-allow-btn"
                            onClick={async () => {
                              let deluid = "request" + request?.ruid; //uid to be deleted from requests collection
                              await firestore //adding the user to current user's followers
                                .collection("users")
                                .doc(value?.uid)
                                .collection("followers")
                                .doc(request?.ruid)
                                .set({
                                  name: request?.name,
                                  ruid: request?.ruid,
                                  pfp: request?.pfp,
                                });
                              await firestore
                                .collection("users")
                                .doc(request?.ruid)
                                .update({
                                  followingCount:
                                    firebase.firestore.FieldValue.increment(1),
                                });
                              await firestore
                                .collection("users")
                                .doc(value?.uid)
                                .collection("requests")
                                .doc(deluid)
                                .delete();
                              await firestore
                                .collection("users")
                                .doc(value?.uid)
                                .update({
                                  followersCount:
                                    firebase.firestore.FieldValue.increment(1),
                                });
                            }}
                          >
                            Allow
                          </button>
                          <i
                            class="far fa-times-circle"
                            id="request-close-btn"
                            onClick={async (e) => {
                              await firestore
                                .collection("users")
                                .doc(value?.uid)
                                .collection("requests")
                                .doc("request" + request?.ruid)
                                .delete();
                            }}
                          ></i>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="follows-container">
                    <div className="follows-container-follows-heading">
                      Activity
                    </div>
                    <i
                      class="fas fa-window-close"
                      id="request-container-close-btn"
                      onClick={() => {
                        setreqOpen(false);
                      }}
                    ></i>
                    {allRequests.map((request, index) => {
                      return (
                        <div key={index} className="follows-container-follows">
                          <div className="follows-container-inner-follows">
                            <img
                              src={request.pfp}
                              alt=""
                              className="follows-container-pfp"
                            />
                            <p className="follows-container-username">
                              {request.name}
                            </p>
                            <p className="follows-container-followingyou">
                              started following you
                            </p>
                            <i
                              class="far fa-times-circle"
                              id="follows-container-close"
                              onClick={async (e) => {
                                await firestore
                                  .collection("users")
                                  .doc(value?.uid)
                                  .collection("requests")
                                  .doc("request" + request?.ruid)
                                  .delete();
                              }}
                            ></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            ""
          )}
          <div class="stories-posts-sidebar-container">
            <div class="stories-posts-container">
              <div className="home-stories">
                <ul className="stories-container">
                  <li className="story-list-item">
                    <div className="story-img-container">
                      <img
                        src={pfpUrl}
                        className={
                          ownStories.length > 0 ? "own-stories-circle" : ""
                        }
                        onClick={() => {
                          if (ownStories.length > 0) {
                            history.push({
                              pathname: `/story/${value.uid}`,
                              state: {
                                uid: value?.uid,
                                uname: userName,
                                upfp: pfpUrl,
                              },
                            });
                          }
                        }}
                      />
                    </div>
                    <button
                      className="own-story"
                      onClick={() => {
                        history.push({
                          pathname: "/createstory",
                          state: {
                            uid: value?.uid,
                            uname: userName,
                            upfp: pfpUrl,
                          },
                        });
                      }}
                    >
                      +
                    </button>
                    <h6>{userName}</h6>
                  </li>
                  {storiesArr.map((e) => {
                    return (
                      <li className="story-list-item">
                        <div className="story-img-container">
                          <img
                            className="others-stories"
                            src={e.storyBypfp}
                            onClick={() => {
                              console.log("story clicked");
                              history.push({
                                pathname: `/story/${e.storyByUn}`,
                                state: {
                                  uid: e.storyByUid,
                                  uname: e.storyByUn,
                                  upfp: e.storyBypfp,
                                },
                              });
                            }}
                          />
                        </div>
                        <Link
                          id="link"
                          to={{
                            pathname: `/profile/${e.storyByUn}`,
                            state: { uid: e?.storyByUid },
                          }}
                        >
                          <h6>{e.storyByUn}</h6>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {feedPosts.length > 0 ? (
                <div className="home-posts">
                  {feedPosts.map((post, index) => {
                    return (
                      <Postcard
                        key={index}
                        post={post}
                        value={value}
                        username={userName}
                        pfpUrl={pfpUrl}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="no-posts-container">
                  <p className="no-post-title">No Posts here!</p>
                  <p className="no-post-matter">
                    Please follow people on Instagram-clone to see posts.
                  </p>
                </div>
              )}
            </div>
            <div
              className={
                suggestionsOpen ? "home-sidebar-responsive" : "home-sidebar"
              }
            >
              <i
                class="far fa-times-circle"
                id="suggestions-container-close"
                onClick={() => {
                  setSuggestionsOpen(false);
                }}
              ></i>
              {value ? (
                <>
                  <Suggestions
                    username={userName}
                    profilepic={pfpUrl}
                    uid={value?.uid}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
