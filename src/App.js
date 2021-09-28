import {firestore} from "./firebase";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthProvider from "./AuthProvider";
import Setup from "./components/Setup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Reels from "./components/Reels"
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Chats from "./components/Chats";
import ChatWindow from "./components/ChatWindow";
import StoryComponent from "./components/StoryComponent";
import Createstory from './components/Createstory';
import Post from "./components/Post";
import Loadtest from "./components/Loadtest";
function App() {
  return (
    <>
    <Router>
      <AuthProvider>
          <Switch>
            <Route path="/register">
              <Register/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
           <Route path="/setup">
            <Setup/>
          </Route>
         
          <Route path="/profile/:username">
            <Profile/>
          </Route>
          <Route path="/reels">
            <Reels/>
          </Route>
          <Route path="/chats">
            <Chats/>
          </Route>
          <Route path="/chatwindow/">
            <ChatWindow/>
          </Route>
          <Route path="/loadtest">
            <Loadtest/>
            </Route>
          <Route path="/createstory">
            <Createstory/>
            </Route>
          <Route path="/story/:uid">
            <StoryComponent/>
            </Route>
            <Route path="/post">
              <Post/>
              </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
        </AuthProvider>
    </Router>

    </>
  );
}

export default App;
