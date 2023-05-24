import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MyContext from "../contexts/userContext";

// import getInvoices from api
import { getInvoices } from "../api/api";

export const InvoicesManager = () => {
  const { globalUser, setGlobalUser, globalStatus, setGlobalStatus } =
    useContext(MyContext);

  const [invoices, setInvoices] = useState("");
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  useEffect(() => {
    const getInvoicesFromApi = async () => {
      const invoicesImpoted = await getInvoices();
      setInvoices(invoicesImpoted);

      setInvoicesLoading(false);
    };
    getInvoicesFromApi();
  }, []);
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
                  console.log(invoice);
                  return (
                    <tr key={i}>
                      <th>{invoice.id}</th>
                      <th>{invoice.userName}</th>
                      <th>{invoice.createdAt}</th>
                      <th>{invoice.subtotal}</th>
                      <th>{invoice.discount}</th>
                      <th>{invoice.total}</th>
                      <th>voucher</th>
                      <th>Products</th>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          <div className="paginationArea">
            <ul className="paginationLinks">
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>...</li>
              <li>25</li>
            </ul>
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
