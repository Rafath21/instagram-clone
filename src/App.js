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
import Mainpost from "./components/Mainpost";
import StoryComponent from "./components/StoryComponent";
import Createstory from './components/Createstory';
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
         
          <Route path="/profile">
            <Profile/>
          </Route>
          <Route path="/reels">
            <Reels/>
          </Route>
          <Route path="/chats">
            <Chats/>
          </Route>
          <Route path="/mainpost">
            <Mainpost/>
          </Route>
          <Route path="/chatwindow">
            <ChatWindow/>
          </Route>
          <Route path="/createstory">
            <Createstory/>
            </Route>
          <Route path="/story/:uid">
            <StoryComponent/>
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
