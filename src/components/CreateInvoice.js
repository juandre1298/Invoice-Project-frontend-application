import React, { useEffect } from "react";
import { useState } from "react";
import { getUsers, getProducts } from "../api/api";

// import icons
import { BsImage } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

export const CreateInvoice = (props) => {
  const { showInvoiceCreator, setShowInvoiceCreator } = props;

  // form states
  // display
  const [productsForSale, setProductsForSale] = useState([]);
  const [clients, setClients] = useState([]);

  // inputs
  const [dateOfPurchase, setDateOfPurchase] = useState();
  const [client, setClient] = useState("");
  const [discount, setDiscount] = useState(0);
  const [product, setProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState("");

  // invoice calculations
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // loading controllers
  const [productsAndClientsLoading] = useState(true);
  // get clients and products
  useEffect(() => {
    const getUsersFromApi = async () => {
      const users = await getUsers();
      // sort users
      users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

      setClients(users);
    };
    getUsersFromApi();
    // get products
    const getProductsFromApi = async () => {
      const productsFromApi = await getProducts();
      // sort products
      productsFromApi.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      setProductsForSale(productsFromApi);
    };
    getProductsFromApi();
  }, []);

  // handleAddProduct
  const handleAddProduct = () => {
    if (product) {
      setProducts([
        ...products,
        {
          id: new Date().getTime(),
          clientProductId: productsForSale.filter((e) => e.name === product)[0]
            .clientId,
          name: product,
          quantity: productQuantity,
        },
      ]);
    } else {
      alert("You must select a product.");
    }
  };
  // handleDeletProduct
  const handleDeletProduct = (id) => {
    setProducts(
      products.filter((e) => {
        return e.id != id;
      })
    );
  };
  // handle Submit
  const handleSubmitInvoice = () => {
    console.log("add", dateOfPurchase, client, discount, products, imageFile);
  };
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
            <div className="invoiceCreatorBoxContainer">
              <div className="invoiceCreatorDateDiv">
                <label>Date*</label>
                <br />
                <input
                  type="date"
                  id="date"
                  name="date"
                  onChange={(e) => setDateOfPurchase(e.target.value)}
                />
              </div>
              <div className="invoiceCreatorClientDiv">
                <label>Client*</label>
                <br />
                <select
                  id="dropdown"
                  value={client}
                  className="selectClient"
                  onChange={(e) => {
                    setClient(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {clients.map((e) => {
                    return (
                      <option value={e.name} key={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="invoiceCreatorDiscountDiv">
                <label>Discount ( % )</label>
                <br />
                <input
                  type="number"
                  id="percentageInput"
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e.target.value);
                  }}
                  min="0"
                  max="30"
                  step="5"
                />
              </div>
              <div className="invoiceCreatorProductDiv">
                <label>Product*</label>
                <br />
                <div className="invoiceCreatorPorductContainer">
                  <select
                    id="dropdown"
                    value={product}
                    className="selectProduct"
                    onChange={(e) => {
                      setProduct(e.target.value);
                    }}
                  >
                    <option value="">Select</option>
                    {productsForSale.map((e) => {
                      return (
                        <option value={e.name} key={e.id}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    type="number"
                    id="productQuantity"
                    className="productQuantity"
                    value={productQuantity}
                    onChange={(e) => {
                      setProductQuantity(e.target.value);
                    }}
                    min="1"
                    step="1"
                  />
                  <button onClick={handleAddProduct}>+</button>
                </div>
              </div>
            </div>
            {/* table section */}
            <div className="productTableSection">
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity</th>
                    <th>Product Name</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((e) => (
                    <tr>
                      <td>{e.clientProductId}</td>
                      <td>{e.quantity}</td>
                      <td>{e.name}</td>
                      <td>
                        <button
                          onClick={() => {
                            handleDeletProduct(e.id);
                          }}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
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
          <button
            type="submit"
            value="Add"
            onClick={handleSubmitInvoice}
            className="submitSectionAddBtn"
          >
            Add
          </button>
          <button className="submitSectionCancelBtn">Cancel</button>
        </div>
      </div>
    </section>
  );
};
