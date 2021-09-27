import Skeleton from "@yisheng90/react-loading";
import "../css/loaders.css";
let HomeLoader = () => {
  return (
    <div className="home-loader-container">
      <div className="header-load">
        <Skeleton width={750} height={70} />
      </div>
      <div className="stories-loader-container">
        <Skeleton className="story-load" width={100} circle />
        <Skeleton className="story-load" width={100} circle />
        <Skeleton className="story-load" width={100} circle />
        <Skeleton className="story-load" width={100} circle />
      </div>
      <div className="home-main-container">
        <Skeleton width={750} height={450} />
      </div>
    </div>
  );
};
export default HomeLoader;
