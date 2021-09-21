import { useState, useContext } from "react";
import "./App.css";
import { AuthContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
let Reels = () => {
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let value = useContext(AuthContext);

  return <VideoCard value={value} />;
};
export default Reels;
