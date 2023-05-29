// Import general dependencies
import React, { useEffect, useState } from "react";

// import components and pages
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { InvoicesManager } from "./pages/InvoicesManager";
import { ProductManager } from "./pages/ProductManager";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Import styles

import "./styles/App.css";
import "./styles/home.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/login.css";
import "./styles/register.css";
import "./styles/navbar.css";
import "./styles/invoicesManager.css";
import "./styles/productDisplay.css";
import "./styles/InvoiceCreatorPopUp.css";
import "./styles/imagePopUp.css";
import "./styles/invoiceDashboard.css";

// import for router
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
} from "react-router-dom";

// Import context
import MyContext from "./contexts/userContext";

function App() {
  // Create the global data and check if there's info in the local storage
  const [globalUser, setGlobalUser] = useState(() => {
    const globalUser = localStorage.getItem("globalUser");
    return globalUser ? JSON.parse(globalUser) : "";
  });
  const [globalStatus, setGlobalStatus] = useState(() => {
    const globalStatus = localStorage.getItem("globalStatus");
    return globalStatus ? JSON.parse(globalStatus) : "";
  });
  const [globalMinNav, globalSetMinNav] = useState(false);

  // save in localStorage the login and user info.

  useEffect(() => {
    localStorage.setItem("globalUser", JSON.stringify(globalUser));
  }, [globalUser]);
  useEffect(() => {
    localStorage.setItem("globalStatus", JSON.stringify(globalStatus));
  }, [globalStatus]);
  // invoice creator
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);
  // create the router structure and context provider

  const Layout = () => {
    return (
      <MyContext.Provider
        value={{
          globalUser,
          setGlobalUser,
          globalStatus,
          setGlobalStatus,
          globalMinNav,
          globalSetMinNav,

          showInvoiceCreator,
          setShowInvoiceCreator,
        }}
      >
        <Header />
        <Navbar />
        <ScrollRestoration />
        <Outlet />
      </MyContext.Provider>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Login />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/InvoicesManager",
          element: <InvoicesManager />,
        },
        {
          path: "/productManager",
          element: <ProductManager />,
        },
      ],
    },
  ]);

  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
