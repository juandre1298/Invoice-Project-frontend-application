import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { checkLogin, getUserById } from "../api/api";
import MyContext from "../contexts/userContext";
import { useLogout } from "../services/handleLogout";

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
        navigate("/InvoicesManager");
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
      <div className="companyPresentation">
        <h1>Log in</h1>
        <p>
          We are an international IT consulting firm, focused on software
          development. We use cutting-edge technologies and an innovative
          methodology throughout all lifecycle phases of design and
          implementation for large-scale systems. Our commitment, technical
          expertise, and excellent location allow us to present an innovative
          and bright solution to worldwide customers.
        </p>
      </div>
      <div className="loginBox">
        <img src="LogoAim_Edge.jpg" alt="logo" />
        {globalStatus ? (
          <div>
            <h1>You are already logged, wanna logout?</h1>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        ) : (
          <div>
            <form className="loginForm" onSubmit={handleSubmit}>
              <div>
                <label for="fname">email:</label>
                <br />
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="inputTxt"
                  placeholder="example@email.com"
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
                  className="inputTxt"
                  placeholder="Password"
                  name="password"
                  onChange={(event) => {
                    setUserPassword(event.target.value);
                  }}
                ></input>
              </div>
              <input type="submit" value="submit" className="subminBtn" />
              <Link className="createAccountLink" to="/register">
                don't have an account yet?
              </Link>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
