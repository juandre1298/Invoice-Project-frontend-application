import React, { useContext } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";

export const ProductManager = () => {
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);

  return (
    <section
      className="ProductManager
    "
    >
      {globalStatus ? (
        <h1>
          hi {globalUser.name} you are {globalUser.role}
        </h1>
      ) : (
        <>
          <h1>Please login</h1>
          <Link to="/login">go to login</Link>
        </>
      )}
    </section>
  );
};
