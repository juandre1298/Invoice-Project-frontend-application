import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";

// import dayjs

import dayjs from "dayjs";

// import from api

import {
  getInvoicesByRange,
  getInvoices,
  getInvoicesByRangeByClient,
} from "../api/api";

// import components

import { ProductDisplay } from "../components/ProductDisplay";
import { CreateInvoice } from "../components/CreateInvoice";
import { ImageDisplay } from "../components/ImageDisplay";

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

  const [pagesButtonArray, setPagesButtonArray] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    "...",
  ]);
  const [loadingPages, setLoadingPages] = useState(true);

  const [currentaPage, setCurrentaPage] = useState(1);
  const [products, setProducts] = useState("");
  const [invoceIdSelected, setInvoceIdSelected] = useState(0);

  // states that creates the popups
  const [showProducts, setShowProducts] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);

  // get the total of pages
  useEffect(() => {
    if (globalUser.status === "admin") {
      const getInvoicesFromApi = async () => {
        setLoadingPages(true);
        const invoicesImported = await getInvoices();
        setInvoiceLength(invoicesImported.length);
        setLoadingPages(false);
      };
      getInvoicesFromApi();
    } else {
      const getInvoicesFromApi = async () => {
        const invoicesImported = await getInvoicesByRangeByClient(
          globalUser.id,
          0,
          100000
        );
        setInvoiceLength(invoicesImported.length);
        setLoadingPages(false);
      };
      getInvoicesFromApi();
    }
  }, []);

  // handle page change
  useEffect(() => {
    const lastPage = parseInt(invoiceLength / invoicesPerPage) + 1;

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
  }, [currentaPage, loadingPages]);
  // handleProductDisplay
  useEffect(() => {}, [showProducts]);

  return (
    <section className="invoicesManager">
      {globalStatus ? (
        <div className="invoicesBox">
          {globalUser.status === "admin" ? (
            <button
              onClick={() => {
                setShowInvoiceCreator(!showInvoiceCreator);
              }}
              className="addInvoice"
            >
              + &nbsp; Add Invoice
            </button>
          ) : (
            ""
          )}
          <table>
            <thead>
              {/* table headers */}
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
                      <th>{invoice.discount}%</th>
                      <th>$ {invoice.total}</th>
                      <th>
                        <button
                          className="tableIcons"
                          onClick={() => {
                            setShowImage(!showImage);
                          }}
                        >
                          <TbFileInvoice />
                        </button>
                      </th>
                      <th>
                        <button
                          className="tableIcons"
                          onClick={() => {
                            setShowProducts(!showProducts);
                            setInvoceIdSelected(invoice.id);
                          }}
                        >
                          <FaCubes />
                        </button>
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
              {loadingPages ? (
                <p>loading pages...</p>
              ) : (
                <>
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
                </>
              )}
            </ul>
            <div className="invoicesPerPage">
              Invoices per page: {invoicesPerPage}
            </div>
          </div>
          {showProducts && <ProductDisplay products={products} />}
          {showImage && <ImageDisplay />}
          {showInvoiceCreator && (
            <CreateInvoice
              showInvoiceCreator={showInvoiceCreator}
              setShowInvoiceCreator={setShowInvoiceCreator}
            />
          )}
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
