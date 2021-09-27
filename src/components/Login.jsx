import "../css/App.css";
import "../css/Responsive.css";
import { signInWithGoogle, auth } from "../firebase";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useContext, useState } from "react";
let Login = () => {
  let value = useContext(AuthContext);
  let [currUserEmail, setCurrUserEmail] = useState("");
  let [currUserPswd, setCurrUserPswd] = useState("");
  return (
    <div>
      {value ? <Redirect to="/home" /> : ""}
      <div className="login-form-container">
        <div class="form-container">
          <h1>Welcome Back!</h1>
          <h3>Please Login</h3>
          <hr />

          <label for="email">
            <b>Email</b>
          </label>
          <input
            onChange={(e) => {
              setCurrUserEmail(e.currentTarget.value);
            }}
            class="email-input"
            type="text"
            placeholder="Enter Email"
            name="email"
            id="email"
            required
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            onChange={(e) => {
              setCurrUserPswd(e.currentTarget.value);
            }}
            class="password-input"
            type="password"
            placeholder="Enter Password"
            name="psw"
            id="psw"
            required
          />
          <hr />

          <button
            onClick={(e) => {
              e.preventDefault();
              auth
                .signInWithEmailAndPassword(currUserEmail, currUserPswd)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err.message);
                  alert(err.message);
                });
            }}
            type="submit"
            class="loginbtn"
          >
            Login
          </button>
        </div>

        <div class="container-signin">
          <button onClick={signInWithGoogle} className="login-with-google">
            Login with Google
          </button>
        </div>
        <p>
          Don't have an account?
          <Link id="link-login" to="register">
            Register
          </Link>
        </p>
      </div>
      ;
    </div>
  );
};
export default Login;
