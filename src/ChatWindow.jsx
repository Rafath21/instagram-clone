import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { firestore } from "./firebase";
import { AuthContext } from "./AuthProvider";
import firebase from "firebase/app";

import "./App.css";
let ChatWindow = () => {
  let [currMsg, setCurrMsg] = useState("");
  let value = useContext(AuthContext);
  const location = useLocation();
  let senderpfp = location.state.senderPfp;
  let senderUn = location.state.senderUn;
  let [msgs, setMsgs] = useState([]);
  console.log(senderUn);
  console.log(senderpfp);
  useEffect(async () => {
    let unsubscription = await firestore
      .collection("users")
      .doc(value.uid)
      .collection("chats")
      .doc(location.state.senderUid)
      .onSnapshot((querySnapshot) => {
        console.log(querySnapshot.data());
        setMsgs(querySnapshot.data()?.msgs);
      });
    return () => {
      unsubscription();
    };
  }, []);
  async function handleSendmsg() {
    let msgId = value.uid + "msg" + Date.now();
    await firestore
      .collection("users")
      .doc(value.uid)
      .collection("chats")
      .doc(location.state.senderUid)
      .set(
        {
          senderPfp: senderpfp,
          senderUid: location.state.senderUid,
          senderUsername: senderUn,
          msgs: firebase.firestore.FieldValue.arrayUnion({
            chatId: msgId,
            msg: currMsg,
          }),
        },
        { merge: true }
      );
    await firestore
      .collection("users")
      .doc(location.state.senderUid)
      .collection("chats")
      .doc(value.uid)
      .set(
        {
          senderPfp: location.state.ownpfp,
          senderUid: location.state.ownUid,
          senderUsername: location.state.ownUsername,
          msgs: firebase.firestore.FieldValue.arrayUnion({
            chatId: msgId,
            msg: currMsg,
          }),
        },
        { merge: true }
      );
  }
  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <Link
          to={{
            pathname: "/chats",
            state: {
              ownUid: location.state.ownUid,
              ownUsername: location.state.ownUsername,
              ownpfp: location.state.ownpfp,
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <i class="fas fa-arrow-left"></i>
        </Link>
        <img src={senderpfp} />
        <h4>{senderUn}</h4>
      </div>
      <div className="chat-window-messages">
        {msgs?.map((e) => {
          let classname = "";
          if (e.chatId.split("msg")[0] == value.uid) {
            classname = "chat-message-own";
          } else {
            classname = "chat-message-sender";
          }
          return (
            <div className={classname}>
              <p>{e.msg}</p>
            </div>
          );
        })}
      </div>
      <div className="chat-window-msgform">
        <textarea
          type="text"
          onChange={(e) => {
            setCurrMsg(e.target.value);
          }}
        ></textarea>
        <button onClick={handleSendmsg}>Send</button>
      </div>
    </div>
  );
};
export default ChatWindow;
