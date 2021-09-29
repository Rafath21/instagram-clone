import { useContext, useEffect, useState } from "react";
import "../css/App.css";
import { firestore, auth } from "../firebase";
import { AuthContext } from "../AuthProvider";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import handleFollow from "../handlers/handleFollow";
let Suggestions = (props) => {
  let [suggestions, setSuggestions] = useState([]);
  let timestamp = firebase.firestore.FieldValue.serverTimestamp(); //Hour at which the post was created

  useEffect(() => {
    let f = async () => {
      let arr = [];
      let followingArr = [];
      let following = await firestore
        .collection("users")
        .doc(props.uid)
        .collection("following")
        .get();
      following.forEach((doc) => {
        followingArr.push(doc.data().fluid);
      });
      let querySnapshot = await firestore.collection("users").get();
      querySnapshot.forEach((doc) => {
        let newDoc = doc.data();
        newDoc.followStatus = "Follow";
        let unh = doc.data().uid; //other user's id
        let un = props.uid; //current user id
        if (un != unh) {
          arr.push(newDoc);
        } else {
          console.log("they matched so skipping");
        }
      });
      arr = arr.filter((e) => {
        return !followingArr.includes(e.uid);
      });
      setSuggestions(arr);
    };
    f();
  }, []);

  return (
    <div className="sidebar-container">
      <div className="sidebar-profile">
        <img className="sidebar-pfp" src={props.profilepic} />
        <Link
          to={{
            pathname: `/profile/${props.username}`,
            state: {
              uid: props.uid,
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <p className="sidebar-username">{props.username}</p>
        </Link>
        <button
          className="home-signout-btn"
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign Out
        </button>
      </div>
      <hr />

      <p className="suggestions-title">Suggestions</p>
      <div className="sidebar-suggestions-container">
        {suggestions.map((element, index) => {
          return (
            <div className="suggestion-inner" key={index}>
              <div className="suggestion-pfp">
                <img id="suggestion-pfp" src={element.photoURL} />
              </div>
              <Link
                to={{
                  pathname: `/profile/${element.username}`,
                  state: {
                    uid: element.uid,
                  },
                }}
                style={{ textDecoration: "none" }}
              >
                <div className="suggestion-username">{element.username}</div>
              </Link>
              <div>
                <button
                  className="suggestion-follow-btn"
                  onClick={async (e) => {
                    let reqDoc = await firestore
                      .collection("users")
                      .doc(element.uid)
                      .get();
                    let req = "request" + props.uid;
                    if (reqDoc.data().typeOfAccount == "private") {
                      e.target.innerText = "Requested";
                    } else {
                      e.target.innerText = "Following";
                    }
                    handleFollow(
                      element.uid,
                      element.username,
                      element.photoURL,
                      props.uid,
                      props.username,
                      props.profilepic
                    );
                  }}
                >
                  {element.followStatus}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Suggestions;
