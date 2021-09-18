import { useState } from "react";
import { Link } from "react-router-dom";

let ChatWindow = () => {
  let [messages, setMessages] = useState([]);
  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <Link to="chats">
          <i class="fas fa-arrow-left"></i>
        </Link>
        <h4>Sender Username</h4>
      </div>
      <div className="chat-window-messages"></div>
      <div className="chat-window-writemsg">
        <input type="text"></input>
        <button>Send</button>
      </div>
    </div>
  );
};
export default ChatWindow;
