import { useContext, useState, createContext, useEffect } from "react";
import "./setup.css";
import { Redirect } from "react-router-dom";
import { firestore, storage, auth } from "./firebase";
import { AuthContext } from "./AuthProvider";
let Setup = () => {
  let [userName, setUserName] = useState("");
  let [name, setName] = useState("");
  let [size, setSize] = useState("");
  let [type, setType] = useState("");
  let [bio, setBio] = useState("");
  let defaultPfp =
    "https://firebasestorage.googleapis.com/v0/b/instagram-clone-dfad6.appspot.com/o/blank-profile-picture-973460_960_720.webp?alt=media&token=fa4c49f5-c94d-47d6-9762-0cc46814e9fc";
  let [file, setFile] = useState(defaultPfp);

  let [profile, setProfile] = useState(false);
  let [imgUrl, setimgUrl] = useState(null);
  let [accountType, setAccountType] = useState("private");
  let value = useContext(AuthContext);
  return (
    <div class="setup-container">
      {value ? "" : <Redirect to={{ pathname: "/home" }}></Redirect>}
      {imgUrl ? (
        <Redirect to={{ pathname: "/home", state: { username: userName } }} />
      ) : (
        ""
      )}
      <div class="setup-profile-pic-container">
        <img src={imgUrl ? imgUrl : defaultPfp} alt="profile-pic" />
        <input
          type="file"
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
        />
      </div>
      <div class="setup-username-container">
        <p>Username:</p>
        <input
          type="text"
          placeholder="username for insta-clone.."
          onChange={(e) => {
            setUserName(e.currentTarget.value);
          }}
        />
      </div>
      <div class="setup-account-type-container">
        <p>I want my account to be:</p>
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
      <div class="setup-bio-container">
        <p>Bio:</p>
        <textarea
          placeholder="what best describes you?"
          onChange={(e) => {
            setBio(e.target.value);
          }}
        ></textarea>
      </div>
      <div class="setup-submit-btn">
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            if (userName == "") {
              alert("Please enter a username");
              return;
            }
            if (file == defaultPfp) {
              let prevPfp = await firestore
                .collection("users")
                .doc(value.uid)
                .get();
              if (prevPfp.data().photoURL == null) {
                await firestore.collection("users").doc(value.uid).update({
                  photoURL: defaultPfp,
                });
              }
              setimgUrl(defaultPfp);
              setProfile(true);
            } else {
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
              firestore.collection("users").doc(value.uid).update({
                bio: bio,
              });
              setProfile(true);
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default Setup;
export var userName;
