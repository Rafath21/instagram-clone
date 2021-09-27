import Skeleton from "@yisheng90/react-loading";
import "../css/loaders.css";
let Profileloader = () => {
  return (
    <div className="profile-loader-container">
      <div className="profile-loader-header">
        <div className="profile-circle">
          <Skeleton width={120} circle />
        </div>
        <div className="profile-details">
          <Skeleton width={300} height={30} />
          <Skeleton width={200} height={15} />
          <Skeleton width={50} height={5} />
        </div>
      </div>
      <div className="profile-loader-posts">
        <Skeleton width={650} height={450} />
      </div>
    </div>
  );
};
export default Profileloader;
