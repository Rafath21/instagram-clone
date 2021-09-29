import { useState, useContext, useEffect } from "react";
import "../css/App.css";
import { firestore } from "../firebase";
import { AuthContext } from "../AuthProvider";
import VideoCard from "./VideoCard";
import ReelsLoader from "../Loaders/ReelsLoader";
let Reels = () => {
  let [feedReels, setFeedReels] = useState([]);
  let [loading, setLoading] = useState(false);
  let value = useContext(AuthContext);
  useEffect(async () => {
    setLoading(true);
    let unsubscription = await firestore
      .collection("users")
      .doc(value?.uid)
      .collection("reelsFeed")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        setFeedReels(
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
        <ReelsLoader />
      ) : (
        <div className="reels-container">
          {feedReels.map((reel, index) => {
            return <VideoCard value={value} reel={reel} key={index} />;
          })}
        </div>
      )}
    </>
  );
};
export default Reels;
