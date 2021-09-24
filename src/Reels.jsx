import { useState, useContext, useEffect } from "react";
import "./App.css";
import { firestore } from "./firebase";
import { AuthContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
let Reels = () => {
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let [feedReels, setFeedReels] = useState([]);
  let value = useContext(AuthContext);
  useEffect(async () => {
    let unsubscription = await firestore
      .collection("users")
      .doc(value.uid)
      .collection("reelsFeed")
      .onSnapshot((querySnapshot) => {
        setFeedReels(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      });
    return () => {
      unsubscription();
    };
  }, []);
  return (
    <div className="reels-container">
      {feedReels.map((reel) => {
        console.log(reel);
        return <VideoCard value={value} reel={reel} />;
      })}
    </div>
  );
};
export default Reels;
