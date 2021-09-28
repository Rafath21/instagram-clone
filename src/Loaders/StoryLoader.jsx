import Skeleton from "@yisheng90/react-loading";
import "../css/loaders.css";
let StoryLoader = () => {
  return (
    <div className="story-loader-container">
      <div className="story-header-loader">
        <Skeleton className="story-load" width={80} circle />
        <div className="story-postedby-loader">
          <Skeleton width={350} height={20} />
          <Skeleton width={150} height={10} />
        </div>
      </div>
      <div className="story-loader-main">
        <Skeleton className="story-load" width={600} height={700} />
      </div>
    </div>
  );
};
export default StoryLoader;
