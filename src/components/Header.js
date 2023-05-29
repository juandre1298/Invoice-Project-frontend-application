import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";
import { useLogout } from "../services/handleLogout";

export const Header = () => {
  // import global data
  const {
    globalUser,
    setGlobalUser,
    globalStatus,

    setGlobalStatus,
  } = useContext(MyContext);
  // import handle logout hook
  const handleLogout = useLogout();

  const handleLogoutClick = () => {
    handleLogout();
  };
  const pagesTitle = {
    "/": "Home",
    "/login": "Login",
    "/InvoicesManager": "Invoice",
    "/register": "Sign in",
    "/productManager": "Product Manager",
  };
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <header className="headerSection">
      <img src="LogoAim_Edge.jpg" alt="logo" />

      <div className="pathAndStatus">
        <h1>
          {pagesTitle[currentPath] ? pagesTitle[currentPath] : currentPath}
        </h1>
        <h2>{globalUser.status}</h2>
      </div>
    </header>
  );
};
