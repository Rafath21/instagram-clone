import { useState } from "react";
let Reels = () => {
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  return (
    <div className="video-card">
      <video
        onClick={(e) => {
          if (playing) {
            setPlaying(false);
            e.currentTarget.pause();
          } else {
            setPlaying(true);
            e.currentTarget.play();
          }
        }}
        src=""
      ></video>
      <span className="material-icons-outlined like">favorite_border</span>
      <span
        className="material-icons-outlined comment"
        onClick={() => {
          if (commentboxOpen) setCommentBoxOpen(false);
          else setCommentBoxOpen(true);
        }}
      >
        chat_bubble
      </span>
      <p className="username">
        <b>Username</b>
      </p>
      <p className="song">
        <span className="material-icons-outlined">music_note</span>
        <marquee>song name</marquee>
      </p>
    </div>
  );
};
export default Reels;
