import axios from "axios";

export const getUsers = async () => {
  try {
    let url = "http://localhost:4000/users";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (id) => {
  try {
    let url = `http://localhost:4000/users/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const postNewUser = async (userOb) => {
  try {
    let url = "http://localhost:4000/users";
    const response = await axios.post(url, userOb);
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    let url = "http://localhost:4000/products";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
//check login
export const checkLogin = async (userOb) => {
  try {
    let url = "http://localhost:4000/login";
    const response = await axios.post(url, userOb);
    return response;
  } catch (error) {
    console.log(error);
  }
};
// get invoices
export const getInvoices = async () => {
  try {
    let url = `http://localhost:4000/invoices/`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
// get invoice by id
export const getInvoiceById = async (id) => {
  try {
    let url = `http://localhost:4000/invoices/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// get invoices by range
export const getInvoicesByRange = async (start, end) => {
  try {
    let url = `http://localhost:4000/invoices/${start}/${end}/`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
//// get invoices by range client
export const getInvoicesByRangeByClient = async (clientId, start, end) => {
  try {
    let url = `http://localhost:4000/invoices/client/${clientId}/${start}/${end}/`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// post new invoice
export const postInvoice = async (invoiceOb) => {
  try {
    let url = "http://localhost:4000/invoices";
    const response = await axios.post(url, invoiceOb);
  } catch (error) {
    console.log(error);
  }
};
// get secure URL of AWS S3 bucket

export const getSecureUrl = async () => {
  try {
    let url = "http://localhost:4000/s3Url";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// post image in secure URL

export const postImageS3 = async () => {};
