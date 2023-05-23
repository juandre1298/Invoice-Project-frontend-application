import "./styles/App.css";
import "./styles/home.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/login.css";
import "./styles/register.css";

import React, { useEffect, useState } from "react";

import { Header } from "./components/Header";

import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";

import { Footer } from "./components/Footer";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
} from "react-router-dom";

// create context
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

  // save in localStorage the login and user info.

  useEffect(() => {
    localStorage.setItem("globalUser", JSON.stringify(globalUser));
  }, [globalUser]);
  useEffect(() => {
    localStorage.setItem("globalStatus", JSON.stringify(globalStatus));
  }, [globalStatus]);

  // create the router structure and context provider

  const Layout = () => {
    return (
      <MyContext.Provider
        value={{ globalUser, setGlobalUser, globalStatus, setGlobalStatus }}
      >
        <Header />
        <ScrollRestoration />
        <Outlet />
        <Footer />
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
          element: <Home />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
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
