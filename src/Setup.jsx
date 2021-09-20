import { useContext, useState, createContext } from "react";
import "./App.css";
import { Redirect } from "react-router-dom";
import { firestore, storage, auth } from "./firebase";
import { AuthContext } from "./AuthProvider";

let Setup = () => {
  let [userName, setUserName] = useState("");
  let [name, setName] = useState("");
  let [size, setSize] = useState("");
  let [type, setType] = useState("");
  let [file, setFile] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  let [profile, setProfile] = useState(false);
  let [imgUrl, setimgUrl] = useState(null);
  let [accountType, setAccountType] = useState("private");
  let value = useContext(AuthContext);
  return (
    <div className="setup-container">
      {imgUrl ? (
        <Redirect to={{ pathname: "/home", state: { username: userName } }} />
      ) : (
        ""
      )}

      <img
        className="profile-pic"
        src={
          imgUrl
            ? imgUrl
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        alt="profile-pic"
      />
      <input
        onClick={(e) => {
          e.target.value = null;
        }}
        onChange={(e) => {
          if (!e.target.files[0]) return;

          setName(e.target.files[0].name);
          setSize(e.target.files[0].size);
          setType(e.target.files[0].type);

          setFile(e.target.files[0]);

          let types = type.split("/");
          setType(types[0]);
          console.log(type);
          if (type.localeCompare("image")) {
            console.log(type);
            alert("please select an image");
          }
        }}
        className="setup-pfp-input"
        type="file"
      />
      <div className="account-type">
        <p>I want my account to be</p>
        <select
          id="account-type"
          onChange={(e) => {
            setAccountType(e.target.value);
            console.log(accountType);
          }}
        >
          <option value="private">Private</option>
          <option value="private">Public</option>
        </select>
      </div>
      <div className="setup-username">
        <p>Username:</p>
        <input
          onChange={(e) => {
            setUserName(e.currentTarget.value);
          }}
          className="setup-name-input"
          type="text"
          placeholder="username for insta-clone"
        />
        <button
          className="pfp-submit-btn"
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            if (userName == "") {
              alert("Please enter a username");
              return;
            }
            if (file == "") {
              alert("Please select a profile pic");
              return;
            }
            let f1 = (snapshot) => {
              console.log(snapshot.bytesTransferred);
              console.log(snapshot.totalBytes);
            };
            //f2 function passed to state_changed event for error handling
            let f2 = (error) => {
              console.log(error);
            };
            let f3 = () => {
              let p = uploadPfp.snapshot.ref.getDownloadURL();
              p.then((url) => {
                firestore.collection("users").doc(value.uid).update({
                  photoURL: url,
                });
                setimgUrl(url);
              });
            };
            let uploadPfp = storage
              .ref(`/pfps/${value.uid}/${Date.now() + name}`)
              .put(file);
            console.log(uploadPfp._uploadUrl);
            uploadPfp.on("clicked", f1, f2, f3);

            firestore.collection("users").doc(value.uid).update({
              username: userName,
            });
            firestore.collection("users").doc(value.uid).update({
              uid: value.uid,
            });
            firestore.collection("users").doc(value.uid).update({
              typeOfAccount: accountType,
            });

            setProfile(true);
          }}
        >
          Submit
        </button>
      </div>
      <div className="setup-bio">
        <p>Bio:</p>
        <textarea placeholder="what best describes you?"></textarea>
      </div>
    </div>
  );
};
export var userName;
export default Setup;
