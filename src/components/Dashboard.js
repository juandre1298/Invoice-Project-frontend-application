import react, { useContext, useState, useRef, useEffect } from "react";

import MyContext from "../contexts/userContext";
// import Chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { PieChart } from "./PieChart";

// import from api
import { getUsers } from "../api/api";
import { getProducts } from "../api/api";

export const InvoiceDashboard = (props) => {
  const { allInvoices } = props;
  const {
    globalUser,
    setGlobalUser,
    globalStatus,
    setGlobalStatus,
    showInvoiceCreator,
    setShowInvoiceCreator,
  } = useContext(MyContext);
  // states
  // general states
  const [client, setClient] = useState(globalUser.name);
  const [clients, setClients] = useState([]);
  const [productsForSale, setProductsForSale] = useState([]);

  // chart states
  const [dataForChart, setDataForChart] = useState([]);
  const [initialDate, setInitialDate] = useState(0);
  const [finalDate, setFinalDate] = useState(Date.now());
  const [loadingChartData, setLoadingChartData] = useState(true);
  const [screenWidth, setScreenWidth] = useState("bottom");
  // chart controller
  const [dataDisplay, setDataDisplay] = useState("TotalMoney");

  ChartJS.register(ArcElement, Tooltip, Legend);

  // get clients and products and generate dataFroChart
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

    getUsersFromApi().then(() => {
      getProductsFromApi().then(() => {
        createData();
      });
    });
  }, [allInvoices]);
  // calculate width
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    const updateChartOptions = () => {
      const screenWidth = window.innerWidth;
      const legendPosition =
        screenWidth < 1024 ? (screenWidth < 740 ? "top" : "right") : "bottom";

      setScreenWidth(legendPosition);
      if (chartInstance.current) {
        chartInstance.current.options.plugins.legend.position = legendPosition;
        chartInstance.current.update();
      }
    };

    // Update the chart options when the window is resized
    window.addEventListener("resize", updateChartOptions);

    return () => {
      // Cleanup event listener
      window.removeEventListener("resize", updateChartOptions);
    };
  }, []);
  const createData = () => {
    const purchaseArray = clients.map((clientN) =>
      allInvoices.filter(
        (invoiceN) =>
          invoiceN.userId === clientN.id &&
          new Date(invoiceN.dateOfEntry) >= new Date(initialDate) &&
          new Date(invoiceN.dateOfEntry) <= new Date(finalDate)
      )
    );

    const clientsData = generateData(purchaseArray);

    // generate
    const data = {
      labels: clientsData.map((e) => e.name).filter((e) => e),
      datasets: [
        {
          label: "Customer purchase",
          data: clientsData.map((e) => e[dataDisplay]).filter((e) => e),
          backgroundColor: [
            "rgba(0, 51, 204, 0.5)", // Deep blue
            "rgba(51, 102, 255, 0.5)", // Medium blue
            "rgba(102, 153, 255, 0.5)", // Light blue
            "rgba(128, 128, 128, 0.5)", // Medium gray
            "rgba(192, 192, 192, 0.5)", // Light gray
            "rgba(224, 224, 224, 0.5)", // Very light gray
            "rgba(147, 112, 219, 0.5)", // Medium purple
            "rgba(218, 112, 214, 0.5)", // Orchid
            "rgba(138, 43, 226, 0.5)", // Blue violet
            "rgba(0, 0, 0, 0.5)", // Black
            "rgba(32, 32, 32, 0.5)", // Dark gray
          ],
          borderColor: [
            "rgba(0, 51, 204, 1)", // Deep blue
            "rgba(51, 102, 255, 1)", // Medium blue
            "rgba(102, 153, 255, 1)", // Light blue
            "rgba(128, 128, 128, 1)", // Medium gray
            "rgba(192, 192, 192, 1)", // Light gray
            "rgba(224, 224, 224, 1)", // Very light gray
            "rgba(147, 112, 219, 1)", // Medium purple
            "rgba(218, 112, 214, 1)", // Orchid
            "rgba(138, 43, 226, 1)", // Blue violet
            "rgba(0, 0, 0, 1)", // Black
            "rgba(32, 32, 32, 1)", // Dark gray
          ],
          borderWidth: 1,
        },
      ],
    };
    setDataForChart(data);
    setLoadingChartData(false);
  };
  // handel changes
  useEffect(() => {
    createData();
  }, [dataDisplay, initialDate, finalDate]);
  return (
    <div className="dashboardSection">
      <h1>Dashboard</h1>
      <div className="generalInfoContainer">
        <div className="chartControllerContainer">
          <h2>Customers Data</h2>
          <div className="dateSelection">
            <div>
              <label>Initial Date*</label>
              <br />
              <input
                type="date"
                id="inDate"
                name="date"
                onChange={(e) => {
                  setInitialDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label>Final Date*</label>
              <br />
              <input
                type="date"
                id="endDate"
                name="date"
                onChange={(e) => {
                  setFinalDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="chartControllerBtns">
            <label>Chart Data</label>

            <select
              id="dropdown"
              value={dataDisplay}
              className="selectClient"
              onChange={(e) => {
                setDataDisplay(e.target.value);
              }}
            >
              <option value="">Select</option>
              <option value="TotalMoney">Total purchases</option>
              <option value="TotalDiscount">Total Discount</option>
              <option value="totalPurchases">Total Invoices</option>
            </select>
          </div>
        </div>
        {loadingChartData ? (
          <p>loading data...</p>
        ) : (
          <>
            <Pie
              className="pie"
              // Set the desired width of the pie chart
              data={dataForChart}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: screenWidth,
                    display: true, // Change the position of the legend
                  },
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
// generate data
const generateData = (arr) => {
  return arr.map((subClientN) => {
    const TotalMoney = subClientN.reduce((a, b) => {
      return a + b.total;
    }, 0);
    const TotalDiscount = subClientN.reduce((a, b) => {
      return a + (b.subtotal - b.total);
    }, 0);

    const products = subClientN.map((e) => e.product);
    let productCount = {};
    products.forEach((subArray) => {
      subArray.forEach((product) => {
        const productName = product.name;
        if (productCount.hasOwnProperty(productName)) {
          productCount[productName] += product.quantity;
        } else {
          productCount[productName] = product.quantity;
        }
      });
    });

    return {
      name: subClientN[0]?.userName,
      userId: subClientN[0]?.userId,
      TotalMoney,
      totalPurchases: subClientN.length,
      TotalDiscount,
      productCount,
    };
  });
};
