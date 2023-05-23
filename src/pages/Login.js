import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { checkLogin, getUserById } from "../api/api";
import MyContext from "../contexts/userContext";
import { useLogout } from "../functions/handleLogout";

export const Login = () => {
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");

  const [userPassword, setUserPassword] = useState("");
  const [users, setUsers] = useState("");

  // Handle login attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if the user is in the user box
    if (userEmail) {
      // check if the password matchs
      const data = await checkLogin({
        email: userEmail,
        password: userPassword,
      });
      const { authentication, status, id } = data.data;
      if (authentication) {
        const actualUser = await getUserById(id);
        setGlobalUser(actualUser);
        alert(
          "Hi " +
            actualUser.name.charAt(0).toUpperCase() +
            actualUser.name.slice(1) +
            "! welcome back!"
        );
        setGlobalStatus(true);
        navigate("/");
      } else {
        alert("Wrong password, please try again");
      }
    } else {
      alert("please type a user email");
    }
  };
  // Handle Logout
  const handleLogout = useLogout();

  const handleLogoutClick = () => {
    handleLogout();
  };
  return (
    <section className="loginMain">
      {globalStatus ? (
        <div>
          <h1>You are already logged, wanna logout?</h1>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      ) : (
        <div className="loginBox">
          <h1>Login</h1>
          <form className="loginForm" onSubmit={handleSubmit}>
            <div>
              <label for="fname">User:</label>
              <br />
              <input
                type="text"
                id="user"
                name="user"
                onChange={(event) => {
                  setUserEmail(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <label for="fname">Password:</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                onChange={(event) => {
                  setUserPassword(event.target.value);
                }}
              ></input>
            </div>
            <input type="submit" value="submit" />
            <Link className="createAccountLink" to="/register">
              don't have an account yet?
            </Link>
          </form>
        </div>
      )}
    </section>
  );
};
