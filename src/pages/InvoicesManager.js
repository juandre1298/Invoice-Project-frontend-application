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
import { InvoiceDashboard } from "../components/Dashboard";
import { Pagination } from "../components/Pagination";

// import icons

import { TbFileInvoice } from "react-icons/tb";
import { FaCubes } from "react-icons/fa";

export const InvoicesManager = () => {
  const {
    globalUser,
    setGlobalUser,
    globalStatus,
    setGlobalStatus,
    showInvoiceCreator,
    setShowInvoiceCreator,
  } = useContext(MyContext);

  // general states
  const [allInvoices, setAllInvoices] = useState([]);
  const [invoices, setInvoices] = useState("");
  const [totalInvoicesCount, setTotalInvoicesCount] = useState(0);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

  const [loadingPages, setLoadingPages] = useState(true);

  const [products, setProducts] = useState("");

  // pop ups states

  // states that creates the popups
  const [showProducts, setShowProducts] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const [invoiceSelected, setInvoceSelected] = useState({});
  const [invoceImgSelected, setInvoceImgSelected] = useState({});

  // get the total of pages
  const getInvoicesFromApi = async (ini = 0, end = 5) => {
    setInvoicesLoading(true);
    let res = "";
    if (globalUser.status === "admin") {
      res = await getInvoicesByRange(ini, end);
    } else {
      res = await getInvoicesByRangeByClient(globalUser.id, ini, end);
    }
    console.log("total invoice", res);
    setTotalInvoicesCount(res.totalInvoices);
    setInvoices(res.invoices);
    setInvoicesLoading(false);
    setLoadingPages(false);
  };

  return (
    <section className="invoicesManager">
      <InvoiceDashboard allInvoices={allInvoices} />

      {globalStatus ? (
        <div className="invoicesBox">
          {globalUser.status === "admin" && (
            <button
              onClick={() => {
                setShowInvoiceCreator(!showInvoiceCreator);
              }}
              className="addInvoice"
            >
              + &nbsp; Add Invoice
            </button>
          )}
          <table className="table">
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
              <tbody>
                <tr>
                  <td className="loadingInvoicesBox">loading invoices...</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {invoices.map((invoice, i) => {
                  return (
                    <tr key={i}>
                      <td data-title="#Invoice">{invoice.id}</td>
                      <td data-title="Client">{invoice.userName}</td>
                      <td data-title="Date">
                        {dayjs(invoice.dateOfEntry).format("DD/MM/YYYY")}
                      </td>
                      <td data-title="Subtotal">$ {invoice.subtotal}</td>
                      <td data-title="Discount">{invoice.discount}%</td>
                      <td data-title="Total">$ {invoice.total}</td>
                      <td data-title="Voucher">
                        <button
                          className="tableIcons"
                          onClick={() => {
                            setInvoceSelected({
                              id: invoice.id,
                              products: invoice?.products,
                            });
                            setInvoceImgSelected(invoice.image);
                            setShowImage(!showImage);
                          }}
                        >
                          <TbFileInvoice />
                        </button>
                      </td>
                      <td data-title="Products">
                        <button
                          className="tableIcons"
                          onClick={() => {
                            setInvoceSelected({
                              id: invoice.id,
                              products: invoice?.products,
                            });
                            setShowProducts(!showProducts);
                          }}
                        >
                          <FaCubes />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          <Pagination
            getInvoicesFromApi={getInvoicesFromApi}
            loadingPages={loadingPages}
            totalInvoicesCount={totalInvoicesCount}
            setTotalInvoicesCount={setTotalInvoicesCount}
          />
          {showProducts && (
            <ProductDisplay
              invoiceSelected={invoiceSelected}
              setShowProducts={setShowProducts}
            />
          )}
          {showImage && (
            <ImageDisplay
              showImage={showImage}
              setShowImage={setShowImage}
              invoceSelected={invoiceSelected}
              invoceImgSelected={invoceImgSelected}
            />
          )}
          {showInvoiceCreator && (
            <CreateInvoice
              lastInvoice={allInvoices.slice(-1)}
              setInvoceImgSelected={setInvoceImgSelected}
              showImage={showImage}
              setShowImage={setShowImage}
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
