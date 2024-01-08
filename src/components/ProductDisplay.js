import { useEffect, useState } from "react";
import { getInvoiceById } from "../api/api";

export const ProductDisplay = (props) => {
  // get props
  const { invoiceSelected, showProducts, setShowProducts } = props;

  console.log("props productDisplay:", props, invoiceSelected);
  return (
    <section className="productDisplayFloatingSection">
      <div>
        <div
          className="productDisplayOutOfBoxSection"
          onClick={() => {
            setShowProducts(!showProducts);
          }}
        ></div>
        <div className="productDisplayPopUpBox">
          <h1>Invoice # {invoiceSelected.id}</h1>
          <div
            className="productDisplayTableSection"
            style={
              invoiceSelected.products.length > 5
                ? { "overflow-y": "scroll" }
                : { "overflow-y": "none" }
            }
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Product Name</th>
                </tr>
              </thead>
              <tbody>
                {invoiceSelected.products.map((e) => (
                  <tr>
                    <td data-title="Id">{e.productId}</td>
                    <td data-title="Quantity">{e.quantity}</td>
                    <td data-title="Name">{e.productName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
