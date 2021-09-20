import {firestore} from "./firebase";
import Login from "./Login";
import Register from "./Register";
import AuthProvider from "./AuthProvider";
import Setup from "./Setup";
import Home from "./Home";
import Profile from "./Profile";
import Reels from "./Reels"
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Chats from "./Chats";
import ChatWindow from "./ChatWindow";
import Mainpost from "./Mainpost";
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
