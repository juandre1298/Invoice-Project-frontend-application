import { useEffect, useState } from "react";
import { getInvoiceById } from "../api/api";

export const ProductDisplay = (props) => {
  // get props
  let { invoceIdSelected, showProducts, setShowProducts } = props;

  // set States
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [invoiceData, setInvoiceData] = useState({});

  // get invoices
  useEffect(() => {
    const getInvoiceData = async () => {
      const data = await getInvoiceById(invoceIdSelected);

      setInvoiceData(data);

      setLoadingInvoice(false);
    };
    getInvoiceData();
  }, []);
  return (
    <section className="floatingSection">
      <div
        className="productDisplayOutOfBoxSection"
        onClick={() => {
          setShowProducts(!showProducts);
        }}
      ></div>
      <div className="productDisplayPopUpBox">
        {loadingInvoice ? (
          <h1>loading...</h1>
        ) : (
          <>
            <h1>Products # {invoiceData.id}</h1>
            <div
              className="productDisplayTableSection"
              style={
                invoiceData.product.length > 5
                  ? { "overflow-y": "scroll" }
                  : { "overflow-y": "hide" }
              }
            >
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Product Name</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.product.map((e) => (
                    <tr>
                      <td>{e.clientId}</td>
                      <td>{e.quantity}</td>
                      <td>{e.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
