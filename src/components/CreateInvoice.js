import React, { useEffect } from "react";
import { useState } from "react";
import { getUsers, postInvoice, getProducts } from "../api/api";

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
  const [discountPass, setDiscountPass] = useState(false);

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
      if (productQuantity > 0) {
        setProducts([
          ...products,
          {
            id: new Date().getTime(),
            clientProductId: productsForSale.filter(
              (e) => e.name === product
            )[0].clientId,
            name: product,
            quantity: productQuantity,
          },
        ]);
      } else {
        alert("Please select a positive quantity");
      }
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
  // calculate total and subtotal
  useEffect(() => {
    let temporalSubTotal = 0;
    products.forEach((currentProduct) => {
      temporalSubTotal =
        temporalSubTotal +
        productsForSale.filter((e) => e.name === currentProduct.name)[0].price *
          currentProduct.quantity;
    });
    setSubtotal(temporalSubTotal);
    setTotal(temporalSubTotal * (1 - discount / 100));
  }, [products, discount]);
  // handle Submit
  const handleSubmitInvoice = () => {
    // handle discount rules
    let maxDiscount = 10;
    const milisInYear = 1000 * 60 * 60 * 24 * 365.25;
    if (client) {
      const clientDateOfEntry = clients.filter((e) => {
        return e.name === client;
      })[0].dateOfEntry;

      const clientTimeYears =
        (Date.now() - new Date(clientDateOfEntry)) / milisInYear;

      // if 1000> => 10% is not necessary since the starting is 10%
      // if >3 years => 30%
      if (clientTimeYears > 3) {
        maxDiscount = 30;
      }
      // if 2000> => 45%
      if (subtotal > 2000) {
        maxDiscount = 45;
      }
      if (discount > maxDiscount) {
        alert(
          `We are sorry but the discount is greater than the maximum permit of ${maxDiscount}%`
        );
      } else {
        setDiscountPass(true);
      }
    }
    // check if the info is complete:
    if (dateOfPurchase && client && products && total != 0 && discountPass) {
      // create object
      const userId = clients.filter((e) => {
        return e.name === client;
      })[0].id;

      const invoiceOb = {
        userId,
        discount,
        dateOfEntry: dateOfPurchase,
        subtotal,
        total,
        imageFile,
        products: products.map((e) => {
          return { name: e.name, quantity: e.quantity };
        }),
      };
      postInvoice(invoiceOb);
      alert("Invoice created!");
      setShowInvoiceCreator(false);
    } else {
      alert(
        "Something is wrong; please be sure that all mandatory items (*) are filled."
      );
    }
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
                  max="45"
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
            <div className="InvoiceCreatorTotalSection">
              <div>
                <h2>Subtotal:</h2>
                <h3>${subtotal.toFixed(2)}</h3>
              </div>
              <div>
                <h2>Discount:</h2>
                <h3>{discount}%</h3>
              </div>
              <div>
                <h2 className="InvoiceCreatorTotal">Total:</h2>
                <h3>${total.toFixed(2)}</h3>
              </div>
            </div>
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
          <button
            className="submitSectionCancelBtn"
            onClick={() => {
              setShowInvoiceCreator(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};
