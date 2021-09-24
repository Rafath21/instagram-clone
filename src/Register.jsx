import "./App.css";
import "./Responsive.css"
import { signInWithGoogle, signUpWithUsername, auth } from "./firebase";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext, useState } from "react";

let Register = () => {
  let value = useContext(AuthContext);
  let [currUserEmail, setCurrUserEmail] = useState("");
  let [currUserPswd, setCurrUserPswd] = useState("");
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return (
    <div>
      {value ? <Redirect to="/setup" /> : ""}
      <div className="register-form-container">
        <div className="form-container">
          <h1>Register</h1>
          <p>Please fill in this form to create an account.</p>
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

              if (!currUserEmail.match(validRegex)) {
                alert("Invalid email address!");
                return;
              }
              if (currUserPswd.length < 10) {
                alert("Please make a strong password");
                return;
              }
              auth.createUserWithEmailAndPassword(currUserEmail, currUserPswd);
            }}
            type="submit"
            class="registerbtn"
          >
            Register
          </button>
          <div class="container-signin">
            <button onClick={signInWithGoogle} className="login-with-google">
              SignUp with Google
            </button>
          </div>
          <div class="container-signin">
            <p>
              Already have an account?
              <Link id="link-login" to="/login">
                Sign in
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export var currUserName;

export default Register;
