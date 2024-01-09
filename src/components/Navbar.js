import React, { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// icons
import { TbFileInvoice } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaCubes } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";

// context
import MyContext from "../contexts/userContext";
import { useLogout } from "../services/handleLogout";

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
  // calculate width
  // burgerMenu
  const [burgerMenu, setBurgerMenu] = useState(window.innerWidth < 400);
  useEffect(() => {
    const updateChartOptions = () => {
      const screenWidth = window.innerWidth;
      const burgerLogic = screenWidth < 400;
      setBurgerMenu(burgerLogic);
    };

    // Update the chart options when the window is resized
    window.addEventListener("resize", updateChartOptions);

    return () => {
      // Cleanup event listener
      window.removeEventListener("resize", updateChartOptions);
    };
  }, []);
  return (
    <nav className={minNav ? "navDisplay" : "navCollapse"}>
      <div className="logoArea">
        <h1>Easy Bills Hub</h1>
      </div>
      <ul className="NavLinksArea">
        <li>
          <Link className="iconAndText" to="/InvoicesManager">
            <TbFileInvoice className="invoiceIcon" />
            <span>Invoices</span>
          </Link>
        </li>

        {globalUser.status === "admin" && (
          <>
            <li className="invoiceCreatorOnNavbar">
              <button
                onClick={() => {
                  setShowInvoiceCreator(!showInvoiceCreator);
                }}
                className="addInvoice  "
              >
                + &nbsp; Add Invoice
              </button>
            </li>
            {/*    <li className="invoiceCreatorOnNavbar">
              <Link className="iconAndText" to="/productManager">
                <FaCubes className="invoiceIcon" />
                <span>Product Manager</span>
              </Link>
            </li> */}
          </>
        )}
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
        {burgerMenu ? (
          <BiMenu />
        ) : minNav ? (
          <MdNavigateBefore />
        ) : (
          <MdNavigateNext />
        )}
      </button>
    </nav>
  );
};
