import Skeleton from "@yisheng90/react-loading";
import "../css/loaders.css";

let Reelsloader = () => {
  return (
    <div className="reels-loader-container">
      <div className="videocard-loader">
        <div className="reel-postedby-loader">
          <div className="reel-pfp-loader">
            <Skeleton width={120} circle />
          </div>
          <div className="reel-postdetails-loader">
            <Skeleton width={300} height={30} />
            <Skeleton width={200} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reelsloader;
