import "../css/App.css";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import ChatWindow from "./ChatWindow";
import Chatloader from "../Loaders/Chatsloader";
let Chats = () => {
  let [allChats, setAllChats] = useState([]);
  let value = useContext(AuthContext);
  let location = useLocation();
  let [loading, setLoading] = useState(false);
  useEffect(async () => {
    setLoading(true);
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
    setLoading(false);
    return () => {
      unsubscription();
    };
  }, []);

  return (
    <>
      {loading ? (
        <Chatloader />
      ) : (
        <div className="chats-container">
          <div className="chats-header">
            <Link to="home">
              <i class="fas fa-arrow-left" id="link"></i>
            </Link>
            <h3>Chats</h3>
            <hr></hr>
          </div>
          <div className="chats">
            {allChats.map((e) => {
              return (
                <>
                  <Link
                    to={{
                      pathname: "chatwindow",
                      state: {
                        senderUid: e.senderUid,
                        senderPfp: e.senderPfp,
                        senderUn: e.senderUsername,
                        ownUid: location.state.uid ? location.state.uid : "",
                        ownUsername: location.state.username,
                        ownpfp: location.state.pfpUrl,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="chat" id="link">
                      <img src={e.senderPfp} />
                      <h4>{e.senderUsername}</h4>
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
export default Chats;
