import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";
import { useLogout } from "../services/handleLogout";

export const Header = () => {
  // import global data
  const { globalUser } = useContext(MyContext);
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
      <div className="logoBox" style={{ gap: "10px" }}>
        <img
          src="lionlogo.png"
          style={{ height: "65px", width: "65px" }}
          alt="logo"
        />
        <span>EBH</span>
      </div>
      <div className="pathAndStatus">
        <h1>
          {pagesTitle[currentPath] ? pagesTitle[currentPath] : currentPath}
        </h1>
        <h2>{globalUser.role}</h2>
      </div>
    </header>
  );
};
