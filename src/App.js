import {firestore} from "./firebase";
import Login from "./Login";
import Register from "./Register";
import AuthProvider from "./AuthProvider";
import Setup from "./Setup";
import Home from "./Home";
import Profile from "./Profile";
import Reels from "./Reels"
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
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
          <Route path="/home">
            <Home/>
          </Route>
          <Route path="/profile">
            <Profile/>
          </Route>
          <Route path="/reels">
            <Reels/>
          </Route>
         
        </Switch>
        </AuthProvider>
    </Router>

    </>
  );
}

export default App;
