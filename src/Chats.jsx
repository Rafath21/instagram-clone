import "./App.css";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext, useEffect, useState } from "react";
import { firestore } from "./firebase";
import ChatWindow from "./ChatWindow";
let Chats = () => {
  let [allChats, setAllChats] = useState([]);
  let value = useContext(AuthContext);
  useEffect(async () => {
    let unsubscription = await firestore
      .collection("users")
      .doc(value.uid)
      .collection("chats")
      .onSnapshot((querySnapshot) => {
        setAllChats(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    console.log(allChats);
    return () => {
      unsubscription();
    };
  }, []);
  return (
    <div className="chats-container">
      <div className="chats-header">
        <Link to="home">
          <i class="fas fa-arrow-left"></i>
        </Link>
        <h3>Chats</h3>
        <hr></hr>
      </div>
      <div className="chats">
        {allChats.map((e) => {
          return (
            <div
              className="chat"
              onClick={() => {
                <ChatWindow />;
              }}
            >
              <img src={e.chatPfp} />
              <h4>{e.chatUsername}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Chats;
