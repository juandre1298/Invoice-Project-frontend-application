import { BsImage } from "react-icons/bs";

export const CreateInvoice = (props) => {
  const { showInvoiceCreator, setShowInvoiceCreator } = props;
  return (
    <section className="InvoiceCreatorPopUpSection">
      <div
        className="InvoiceCreatorOutOfBoxSection"
        onClick={() => {
          setShowInvoiceCreator(!showInvoiceCreator);
        }}
      ></div>
      <div className="InvoiceCreatorPopUpBox">
        <h1>Add New Invoice</h1>
        <div className="invoiceCreatorForm">
          <div className="invoiceCreatorDetails">
            <h2>User Details</h2>
            <from className="invoiceCreatorBoxContainer">
              <div className="invoiceCreatorDateDiv">
                <label>Date*</label>
                <br />
                <input type="date" id="date" name="date" />
              </div>
              <div className="invoiceCreatorClientDiv">
                <label>Client*</label>
                <br />
                <input type="text" id="date" name="date" />
              </div>
              <div className="invoiceCreatorDiscountDiv">
                <label>Discount</label>
                <br />
                <input type="text" id="date" name="date" />
              </div>
              <div className="invoiceCreatorProductDiv">
                <label>Product*</label>
                <br />
                <div className="invoiceCreatorPorductContainer">
                  <input type="text" id="date" name="date" />
                  <p>1</p>
                  <button>+</button>
                </div>
              </div>
            </from>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Product Name</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div className="invoiceCreatorVoucher">
            <h2>Voucher</h2>
            <div>
              <BsImage className="imageIcon" />
            </div>
            <button>select Image</button>
          </div>
        </div>
        <div className="submitSection">
          <submit className="submitSectionAddBtn">Add</submit>
          <button className="submitSectionCancelBtn">Cancel</button>
        </div>
      </div>
    </section>
  );
};
