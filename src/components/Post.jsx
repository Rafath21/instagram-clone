import { useLocation } from "react-router";
import Postcard from "./Postcard";

let Post = () => {
  let location = useLocation();
  return (
    <Postcard
      post={location.state.post}
      value={location.state.value}
      username={location.state.username}
      pfpUrl={location.state.upfp}
    />
  );
};
export default Post;
