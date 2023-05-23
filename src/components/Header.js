import React, { useContext } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";
import { useLogout } from "../functions/handleLogout";

export const Header = () => {
  // import global data
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);
  // import handle logout hook
  const handleLogout = useLogout();

  const handleLogoutClick = () => {
    handleLogout();
  };
  return (
    <header>
      <h1>First fullstack app</h1>
      <nav>
        <Link className="navBtn" to="/">
          Home
        </Link>
        {globalStatus ? (
          <div>
            <button onClick={handleLogoutClick}>log out</button>
          </div>
        ) : (
          <Link className="navBtn" to="/login">
            login
          </Link>
        )}
      </nav>
    </header>
  );
};
