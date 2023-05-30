import React, { useEffect } from "react";
import { useState } from "react";
import { getUsers, postInvoice, getProducts } from "../api/api";

// import icons
import { BsImage } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

// import from api
import { guardarArchivo } from "../api/uploatToDrive";
import { postImage } from "../api/api";

/////////////////////////////////////////////////////////////
export const CreateInvoice = (props) => {
  const {
    showInvoiceCreator,
    setShowInvoiceCreator,
    setInvoceImgSelected,
    showImage,
    setShowImage,
  } = props;

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

  // imageStates
  const [imageFile, setImageFile] = useState([]);
  const [imageFileForDrive, setImageFileForDrive] = useState("");
  const [imageObjectResponse, setImageObjectResponse] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [urlForS3, setUrlForS3] = useState("");

  // invoice calculations
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountPass, setDiscountPass] = useState(false);

  //  controllers
  const [productsAndClientsLoading] = useState(true);
  const [maxDiscount, setMaxDiscount] = useState(10);

  // get clients and products
  useEffect(() => {
    const getUsersFromApi = async () => {
      try {
        const users = await getUsers();
        // sort users
        users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

        setClients(users);
      } catch (error) {
        console.log(error);
      }
    };
    getUsersFromApi();
    // get products
    const getProductsFromApi = async () => {
      try {
        const productsFromApi = await getProducts();
        // sort products
        productsFromApi.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        setProductsForSale(productsFromApi);
      } catch (error) {
        console.log(error);
      }
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
  //handle image selection
  const handleImageSelector = (event) => {
    setImageFileForDrive(event);
    const selectedFile = event.target.files;

    const selectedFilesArray = Array.from(selectedFile);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setImageFile(imagesArray);
  };

  // handle Submit
  const handleSubmitInvoice = async () => {
    // handle discount rules
    let max = maxDiscount;
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
        max = 30;
      }
      // if 2000> => 45%
      if (subtotal > 2000) {
        max = 45;
      }
      if (discount > max) {
        alert(
          `We are sorry but the discount is greater than the maximum permit of ${maxDiscount}%`
        );
      }
    }
    // check if the info is complete:
    if (dateOfPurchase && client && products && total != 0 && discount <= max) {
      if (imageFileForDrive) {
        const file = imageFileForDrive.target.files[0]; //the file

        try {
          // uploading to AWS S3
          const { result } = await postImage({ image: file });

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
            image: result?.Location,
            products: products.map((e) => {
              return { name: e.name, quantity: e.quantity };
            }),
          };
          postInvoice(invoiceOb);
          alert("Invoice created!");
          setShowInvoiceCreator(false);
          // upload to google cloud
        } catch (error) {
          console.log(
            "error fetching the url to AWS, will upload to google drive",
            error
          );
          let imageUploadData = {};
          const reader = new FileReader(); //this for convert to Base64
          reader.readAsDataURL(imageFileForDrive.target.files[0]); //start conversion...
          reader.onload = async function () {
            try {
              setUploadingFiles(true);
              //.. once finished..
              const rawLog = reader.result.split(",")[1]; //extract only thee file data part
              const dataSend = {
                dataReq: { data: rawLog, name: file.name, type: file.type },
                fname: "uploadFilesToGoogleDrive",
              }; //preapre info to send to API
              const response = await fetch(
                "https://script.google.com/macros/s/AKfycbw4txtjL418Y9FFV0DE3Q2RoNqVZASrKAdlafEqI8nCL1srrokwIq18lLClbxC3zGV9/exec", //your AppsScript URL
                { method: "POST", body: JSON.stringify(dataSend) }
              );
              const data = await response.json();
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
                image: data?.url,
                products: products.map((e) => {
                  return { name: e.name, quantity: e.quantity };
                }),
              };
              postInvoice(invoiceOb);
              alert("Invoice created!");
              setShowInvoiceCreator(false);
            } catch (error) {
              console.log(error);
            }
          };
          console.log(reader);
        }
      } else {
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
          image: imageObjectResponse?.url,
          products: products.map((e) => {
            return { name: e.name, quantity: e.quantity };
          }),
        };
        postInvoice(invoiceOb);
        alert("Invoice created!");
        setShowInvoiceCreator(false);
      }
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
                      <td data-title="Id">{e.clientProductId}</td>
                      <td data-title="Quantity">{e.quantity}</td>
                      <td data-title="Name">{e.name}</td>
                      <td data-title="Delete">
                        <button
                          className="deleteBtn"
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

            <label for="inputTag" className="invoiceImageButtonLable">
              <div>
                {imageFile.length > 0 ? (
                  <>
                    {imageFile.map((e, i) => {
                      return (
                        <div
                          onClick={() => {
                            setInvoceImgSelected(e);
                            setShowImage(!showImage);
                          }}
                        >
                          <img src={e} className="imageIcon" />
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <form enctype="multipart/from-data">
                    <BsImage className="imageIcon" />
                    <input
                      id="inputTag"
                      type="file"
                      name="image"
                      accept="image/png, image/jpg, image/gif, image/jpeg"
                      onChange={handleImageSelector}
                    />
                  </form>
                )}
              </div>
            </label>
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
      {uploadingFiles && (
        <div className="uploadingFiles">Uploading Files...</div>
      )}
    </section>
  );
};
