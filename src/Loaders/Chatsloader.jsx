import Skeleton from "@yisheng90/react-loading";
import "../css/loaders.css";

let Chatsloader = () => {
  return (
    <div className="chats-loader-container">
      <div className="chat-loader">
        <Skeleton width={120} circle />
        <div className="msg-loader">
          <Skeleton width={300} height={30} />
          <Skeleton width={200} height={30} />
        </div>
      </div>
      <div className="chat-loader">
        <Skeleton width={120} circle />
        <div className="msg-loader">
          <Skeleton width={300} height={30} />
          <Skeleton width={200} height={30} />
        </div>
      </div>
      <div className="chat-loader">
        <Skeleton width={120} circle />
        <div className="msg-loader">
          <Skeleton width={300} height={30} />
          <Skeleton width={200} height={30} />
        </div>
      </div>
    </div>
  );
};
export default Chatsloader;
