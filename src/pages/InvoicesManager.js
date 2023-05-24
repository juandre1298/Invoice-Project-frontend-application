import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";
// import dayjs
import dayjs from "dayjs";
// import getInvoices from api
import {
  getInvoicesByRange,
  getInvoices,
  getInvoicesByRangeByClient,
} from "../api/api";

// import icons

import { TbFileInvoice } from "react-icons/tb";
import { FaCubes } from "react-icons/fa";

export const InvoicesManager = () => {
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);

  // states
  const [invoices, setInvoices] = useState("");
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoiceLength, setInvoiceLength] = useState(0);
  const [invoicesPerPage, setInvoicesPerPage] = useState(5);
  const [currentaPage, setCurrentaPage] = useState(1);
  const [pagesButtonArray, setPagesButtonArray] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    "...",
  ]);

  // get the total of pages
  useEffect(() => {
    if (globalUser.status === "admin") {
      const getInvoicesFromApi = async () => {
        const invoicesImported = await getInvoices();
        console.log(invoicesImported.length);
        setInvoiceLength(invoicesImported.length - 1);
      };
      getInvoicesFromApi();
    } else {
      const getInvoicesFromApi = async () => {
        const invoicesImported = await getInvoicesByRangeByClient(
          globalUser.id,
          0,
          100000
        );
      };
      getInvoicesFromApi();
    }
  }, []);
  // handle page change
  useEffect(() => {
    const lastPage = parseInt(invoiceLength / invoicesPerPage) + 1;
    console.log(
      "invoiceLength",
      invoiceLength,
      "invoicesPerPage",
      invoicesPerPage,
      "lastPage",
      lastPage
    );
    // change pagesButtonArray
    if (currentaPage > 5 && lastPage >= 9) {
      if (currentaPage > lastPage - 4) {
        setPagesButtonArray([
          1,
          "...",
          parseInt(invoiceLength / invoicesPerPage) + 1 - 7,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 6,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 5,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 4,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 3,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 2,
          parseInt(invoiceLength / invoicesPerPage) + 1 - 1,
          parseInt(invoiceLength / invoicesPerPage) + 1,
        ]);
      } else {
        setPagesButtonArray([
          1,
          "...",
          currentaPage - 2,
          currentaPage - 1,
          currentaPage,
          currentaPage + 1,
          currentaPage + 2,
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
    // get invoices if admin
    if (globalUser.status === "admin") {
      const getInvoicesFromApi = async () => {
        const invoicesImported = await getInvoicesByRange(
          (currentaPage - 1) * invoicesPerPage,
          (currentaPage - 1) * invoicesPerPage + invoicesPerPage - 1
        );
        setInvoices(invoicesImported);
        setInvoicesLoading(false);
      };
      getInvoicesFromApi();
    }
    // get invoices if client
    if (globalUser.status === "client") {
      const getInvoicesFromApi = async () => {
        const invoicesImported = await getInvoicesByRangeByClient(
          globalUser.id,
          (currentaPage - 1) * invoicesPerPage,
          (currentaPage - 1) * invoicesPerPage + invoicesPerPage - 1
        );
        setInvoices(invoicesImported);
        setInvoicesLoading(false);
      };
      getInvoicesFromApi();
    }
  }, [currentaPage]);
  // get elements by page

  return (
    <section className="invoicesManager">
      {globalStatus ? (
        <div className="invoicesBox">
          {globalUser.status === "admin" ? (
            <button className="addInvoice">+ &nbsp; Add Invoice</button>
          ) : (
            ""
          )}
          <table>
            <thead>
              <tr>
                <th>#Invoice</th>
                <th>Client</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Voucher</th>
                <th>Products</th>
              </tr>
            </thead>
            {invoicesLoading ? (
              <div className="loadingInvoicesBox">loading invoices...</div>
            ) : (
              <tbody>
                {invoices.map((invoice, i) => {
                  return (
                    <tr key={i}>
                      <th>{invoice.id}</th>
                      <th>{invoice.userName}</th>
                      <th>{dayjs(invoice.createdAt).format("DD/MM/YYYY")}</th>
                      <th>$ {invoice.subtotal}</th>
                      <th>{invoice.discount * 100}%</th>
                      <th>$ {invoice.total}</th>
                      <th className="tableIcons">
                        <TbFileInvoice />
                      </th>
                      <th className="tableIcons">
                        <FaCubes />
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          <div className="paginationArea">
            <div className="invoicesPerPage">Current page: {currentaPage}</div>
            <ul className="paginationLinks">
              {pagesButtonArray.map((e, i) => {
                return (
                  <li
                    key={i}
                    onClick={
                      e === "..."
                        ? () => {}
                        : () => {
                            setCurrentaPage(e);
                          }
                    }
                  >
                    {e}
                  </li>
                );
              })}
            </ul>
            <div className="invoicesPerPage">
              Invoices per page: {invoicesPerPage}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1>Please login</h1>
          <Link to="/login">go to login</Link>
        </>
      )}
    </section>
  );
};
