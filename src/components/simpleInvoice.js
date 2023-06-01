import { useEffect, useContext } from "react";

import MyContext from "../contexts/userContext";

// import for screenshot
import html2canvas from "html2canvas";

export const SimpleInvioce = (props) => {
  const {
    setShowSimpleInvoice,
    showSimpleInvoice,
    dateOfPurchase,
    client,
    discount,
    products,
    subtotal,
    total,
    lastInvoice,
    productsForSale,
  } = props;
  const { globalUser } = useContext(MyContext);
  const takeScreenshot = () => {
    /* const allPopUp = document.getElementById("InvoiceCreatorPopUpBox"); */
    const allPopUp = document.getElementById("realInvoice");

    html2canvas(allPopUp, {
      backgroundColor: "white", // Specify the desired background color
    }).then((canvas) => {
      // Convert the canvas to an image
      var screenshotImg = document.createElement("a");
      screenshotImg.href = canvas.toDataURL("image/png");
      screenshotImg.download = `invoice-No-${lastInvoice[0]?.id + 1}.png`;
      screenshotImg.click();

      // Add the image to the DOM or perform any other desired actions
      //document.body.appendChild(screenshotImg);
    });
  };
  return (
    <section className="SimpleInvoiceSection">
      <div
        className="SimpleInvoiceSectionBoxSection"
        onClick={() => {
          setShowSimpleInvoice(!showSimpleInvoice);
        }}
      ></div>
      <div className="realInvoice" id="realInvoice">
        <div className="areaTitle">
          <img src="/LogoAim_Edge.jpg" alt="company logo" />
        </div>
        <div className="areaClientInvoice">
          <div>
            <h2>BILLED TO:</h2>
            <p>Name:{client[0]?.name}</p>
            <p>Point Of Contact{client[0]?.pointOfContact}</p>
            <p>phone Number: {client[0]?.phoneNumber}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>Invoice No. {lastInvoice[0]?.id + 1}</p>
            <p>Date: {dateOfPurchase}</p>
          </div>
        </div>
        <div className="areaTable">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((e, i) => (
                <tr key={i}>
                  <td data-title="Id">
                    {
                      productsForSale.filter(
                        (element) => element.name === e.name
                      )[0]?.clientId
                    }
                  </td>
                  <td data-title="Name">{e.name}</td>
                  <td data-title="Quantity">{e.quantity}</td>
                  <td data-title="unitPrice">
                    {
                      productsForSale.filter(
                        (element) => element.name === e.name
                      )[0]?.price
                    }
                  </td>
                  <td data-title="Subtotal">
                    {productsForSale.filter(
                      (element) => element.name === e.name
                    )[0]?.price * e.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="totalArea">
          <div className="totalAreaContainer">
            <div>Subtotal: ${subtotal}</div>
            <div>Discount: {discount}%</div>
            <div>Total: ${total}</div>
          </div>
        </div>
        <div className="areaFooter">
          <div>
            <h3>PAYMENT INFORMATION</h3>
            <p>Fake Bank Of America</p>
            <p>Account Name: </p>
            <p>Account No. 12345678910</p>
          </div>
          <div className="companyAdress">
            <div>Aim Edge App</div>
            <div>{globalUser.name}</div>
            <div>{globalUser.phoneNumber}</div>
          </div>
        </div>
      </div>
      <div className="downloadControllerArea">
        <p>Preview</p>
        <div className="downloadControllerAreaBtns">
          <button className="downloadImage" onClick={takeScreenshot}>
            Download
          </button>
          <button
            className="downloadImage cancelBtn"
            onClick={() => {
              setShowSimpleInvoice(!showSimpleInvoice);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};
