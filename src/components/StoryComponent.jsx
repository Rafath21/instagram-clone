import { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { useRouteMatch, useLocation, useHistory, Link } from "react-router-dom";
import { firestore } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import "../css/stories.css";
import StoryLoader from "../Loaders/StoryLoader";
let StoryComponent = () => {
  let match = useRouteMatch();
  let value = useContext(AuthContext);
  let location = useLocation();
  let history = useHistory();
  let storyByUid = location.state.uid;
  let storyByun = location.state.uname;
  let storyBypfp = location.state.upfp;
  let [postedStories, setPostedStories] = useState([]);
  let [loading, setLoading] = useState(true);
  useEffect(async () => {
    console.log("value:", value.uid);
    console.log("posted by:", storyByUid);
    let postedStory;
    if (storyByUid == value.uid) {
      postedStory = await firestore
        .collection("users")
        .doc(value.uid)
        .collection("stories")
        .doc(storyByUid)
        .get();
    } else {
      postedStory = await firestore
        .collection("users")
        .doc(value.uid)
        .collection("storiesFeed")
        .doc(storyByUid)
        .get();
    }
    if (postedStory.data() != undefined) {
      setPostedStories(postedStory.data().postedStories);
    }
    setLoading(false);
  }, []);

  console.log(postedStories);
  function redirectToHome() {
    history.push("/");
  }
  function getStories() {
    let stories = postedStories.map((story) => {
      console.log(story);
      return {
        content: (props) => (
          <div className="story-container">
            <div className="story-header">
              <Link
                className="story-link"
                to={{
                  pathname: `/profile/${storyByun}`,
                  state: {
                    uid: storyByUid,
                  },
                }}
              >
                <img src={storyBypfp} />
                <p>{storyByun}</p>
              </Link>
            </div>
            <div className="story-image-container">
              <img className="story-image" src={story.storyImg} />
            </div>

            <span>{story.storyCaption}</span>
          </div>
        ),
      };
    });
    return stories;
  }

  return (
    <>
      {loading ? (
        <StoryLoader />
      ) : (
        <div className="main-story-container">
          <Stories
            stories={getStories()}
            defaultInterval={5000}
            width={"100%"}
            height="100vh"
            onAllStoriesEnd={redirectToHome}
          />
        </div>
      )}
    </>
  );
};
export default StoryComponent;
