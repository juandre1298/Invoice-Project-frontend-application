import React, { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// context
import MyContext from "../contexts/userContext";
import { useLogout } from "../services/handleLogout";

export const Pagination = (props) => {
  const {
    loadingPages,
    getInvoicesFromApi,
    totalInvoicesCount,
    setTotalInvoicesCount,
  } = props;

  const [pagesButtonArray, setPagesButtonArray] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    "...",
  ]);
  const [currentaPage, setCurrentaPage] = useState(1);
  const [invoicesPerPage, setInvoicesPerPage] = useState(5);

  // handle page change
  const calculatePageArray = (page) => {
    const lastPage = Math.ceil(totalInvoicesCount / invoicesPerPage);
    // change pagesButtonArray
    if (page > 5 && lastPage >= 9) {
      if (page > lastPage - 4) {
        setPagesButtonArray([
          1,
          "...",
          lastPage - 6,
          lastPage - 5,
          lastPage - 4,
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage,
        ]);
      } else {
        setPagesButtonArray([
          1,
          "...",
          page - 2,
          page - 1,
          page,
          page + 1,
          page + 2,
          "...",
          lastPage,
        ]);
      }
    } else {
      if (lastPage > 9) {
        setPagesButtonArray([1, 2, 3, 4, 5, 6, 7, "...", lastPage]);
      } else {
        setPagesButtonArray(Array.from({ length: lastPage }, (_, i) => i + 1));
      }
    }
    // get invoices
  };

  const handlePageChane = (page) => {
    if (page !== "...") {
      setCurrentaPage(page);
      calculatePageArray(page);
      getInvoicesFromApi(
        (page - 1) * invoicesPerPage + 1,
        page * invoicesPerPage
      );
    }
  };

  useEffect(() => {
    handlePageChane(currentaPage);
  }, [totalInvoicesCount]);

  return (
    <div className="paginationArea">
      <div className="invoicesPerPage">Current page: {currentaPage}</div>
      <ul className="paginationLinks">
        {loadingPages ? (
          <p>loading pages...</p>
        ) : (
          <>
            {pagesButtonArray.map((e, i) => {
              return (
                <li key={i} onClick={() => handlePageChane(e)}>
                  {e}
                </li>
              );
            })}
          </>
        )}
      </ul>
      <div className="invoicesPerPage">
        Invoices per page: {invoicesPerPage}
      </div>
    </div>
  );
};
