import { useContext, useEffect, useState } from "react";
import "../css/App.css";
import { firestore, auth } from "../firebase";
import { AuthContext } from "../AuthProvider";
import firebase from "firebase/app";
import { Link } from "react-router-dom";

let Suggestions = (props) => {
  let [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    let f = async () => {
      let arr = [];
      let followingArr = [];
      //figure out-pending
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
            pathname: "/profile",
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
                  pathname: "/profile",
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
                      element.followStatus = "Requested";
                      e.target.innerText = "Requested";
                      await firestore
                        .collection("users")
                        .doc(element.uid)
                        .collection("requests")
                        .doc(req)
                        .set({
                          name: props.username,
                          pfp: props.profilepic,
                          ruid: props.uid,
                        });
                    } else {
                      let docc = "fl" + element.uid;
                      let flr = "fr" + props.uid;
                      element.followStatus = "Following";
                      e.target.innerText = "Following";

                      await firestore //adding the current user to suggested user's followers
                        .collection("users")
                        .doc(props.uid)
                        .collection("following")
                        .doc(element.uid)
                        .set({
                          name: element.username,
                          fluid: element.uid,
                          pfp: element.photoURL,
                        });
                      await firestore
                        .collection("users")
                        .doc(props.uid)
                        .update({
                          followingCount:
                            firebase.firestore.FieldValue.increment(1),
                        });

                      await firestore //adding the current user to suggested user's request list
                        .collection("users") //will be deleted after the user deletes it themselves
                        .doc(element.uid)
                        .collection("requests")
                        .doc(req)
                        .set({
                          name: props.username,
                          pfp: props.profilepic,
                          ruid: props.uid,
                        });
                      await firestore //adding the current user to suggested user's followers list
                        .collection("users")
                        .doc(element.uid)
                        .collection("followers")
                        .doc(props.uid)
                        .set({
                          name: props.username,
                          pfp: props.profilepic,
                          ruid: props.uid,
                        });
                      await firestore
                        .collection("users")
                        .doc(element.uid)
                        .update({
                          followersCount:
                            firebase.firestore.FieldValue.increment(1),
                        });
                    }
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
