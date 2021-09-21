import { useState } from "react";
import "./App.css";
let VideoCard = () => {
  let [commentboxOpen, setCommentBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let [createReelOpen, setCreateReelOpen] = useState(false);
  let [uploadFilename, setuploadFilename] = useState("");
  let [uploadFilesize, setuploadFilesize] = useState("");
  let [uploadFiletype, setuploadFiletype] = useState("");
  let [uploadFile, setuploadFile] = useState("");
  let [uploadFileUrl, setUploadFileurl] = useState(null);
  let [uploadCaption, setuploadCaption] = useState("");
  function handleCreateReel(element) {}
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
        src="https://firebasestorage.googleapis.com/v0/b/reels-7326d.appspot.com/o/posts%2FQyPN8ZovLwe9qWhB6l1qc9MzQr92%2Fsample-mp4-file.mp4?alt=media&token=8575a89d-e5dc-4d9a-99b2-835655338b5b"
      ></video>
      <div className="reels-actions">
        <i class="far fa-heart" id="reel-like"></i>
        <i
          class="fas fa-comments"
          id="reels-comments-icon"
          onClick={() => {
            if (commentboxOpen) setCommentBoxOpen(false);
            else setCommentBoxOpen(true);
          }}
        ></i>
        <p className="username">
          <b>Username</b>
        </p>
        <p className="song">
          <i class="fas fa-music"></i>
          <marquee>song name</marquee>
        </p>
        <i
          class="far fa-plus-square"
          id="create-reel"
          onClick={(e) => {
            setCreateReelOpen(true);
          }}
        ></i>
      </div>
      {createReelOpen ? (
        <div className="create-reel-container">
          <i
            class="far fa-times-circle"
            id="create-reel-container-close"
            onClick={() => {
              setCreateReelOpen(false);
            }}
          ></i>
          <p className="create-reel-heading">Create New Reel</p>
          <input
            type="file"
            className="create-post-input"
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={(e) => {
              if (!e.target.files[0]) return;

              setuploadFilename(e.target.files[0].name);
              setuploadFilesize(e.target.files[0].size);
              setuploadFiletype(e.target.files[0].type);
              setuploadFile(e.target.files[0]);
              uploadFiletype = uploadFiletype.split("/")[0];
              console.log(uploadFiletype);
              if (
                uploadFiletype.localeCompare("image") != 0 &&
                uploadFiletype.localeCompare("video") != 0
              ) {
                console.log(uploadFiletype);
                alert("please select an image");
              }
            }}
          />
          <p className="create-reel-caption-heading">
            Write your caption here...
          </p>
          <textarea
            type="text"
            className="create-reel-caption"
            onChange={(e) => {
              let caption = e.currentTarget.value;
              setuploadCaption(caption);
            }}
          ></textarea>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default VideoCard;
