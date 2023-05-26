import React, { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// icons
import { TbFileInvoice } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

// context
import MyContext from "../contexts/userContext";
import { useLogout } from "../functions/handleLogout";

export const Navbar = () => {
  // import global data
  const {
    globalUser,
    setGlobalUser,
    globalStatus,
    setGlobalStatus,
    showInvoiceCreator,
    setShowInvoiceCreator,
  } = useContext(MyContext);
  // import handle logout hook
  const handleLogout = useLogout();

  const handleLogoutClick = () => {
    handleLogout();
  };

  // handle display and collapse
  const [minNav, setMinNav] = useState(false);
  return (
    <nav className={minNav ? "navDisplay" : "navCollapse"}>
      <div className="logoArea">
        <h1>AIM EDGE APPS</h1>
      </div>
      <ul className="NavLinksArea">
        <li>
          <Link className="iconAndText" to="/InvoicesManager">
            <TbFileInvoice className="invoiceIcon" />
            <span>Invoices</span>
          </Link>
        </li>
        <li className="invoiceCreatorOnNavbar">
          {globalUser.status === "admin" ? (
            <button
              onClick={() => {
                setShowInvoiceCreator(!showInvoiceCreator);
              }}
              className="addInvoice  "
            >
              + &nbsp; Add Invoice
            </button>
          ) : (
            ""
          )}
        </li>
      </ul>
      <div className="logoutBtnArea">
        {globalStatus ? (
          <div>
            <button className="logoutBtn" onClick={handleLogoutClick}>
              <CgLogOut className="logoutIcon" />
              Log out
            </button>
          </div>
        ) : (
          <Link className="logoutBtn" to="/login">
            Log in
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          setMinNav(!minNav);
        }}
        className="minimize"
      >
        {minNav ? <MdNavigateBefore /> : <MdNavigateNext />}
      </button>
    </nav>
  );
};
