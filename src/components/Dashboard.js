import react, { useContext, useState, useRef, useEffect } from "react";

import MyContext from "../contexts/userContext";
// import Chart

import { PieChart } from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

// import from api
import { getUsers } from "../api/api";
import { getProducts } from "../api/api";
import { CostExplorer } from "aws-sdk";

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
  const [client, setClient] = useState("all");

  const [clients, setClients] = useState([]);

  const [productsForSale, setProductsForSale] = useState([]);

  // chart states
  const [dataForPieChart, setDataForPieChart] = useState([]);
  const [dataForFChart, setDataForFChart] = useState({
    labels: [], // Y-axis labels
    datasets: [
      {
        label: "Quantity",
        data: [], // X-axis values
        backgroundColor: "rgba(0, 123, 255, 0.5)", // Bar color
      },
    ],
  });

  const [initialDate, setInitialDate] = useState(0);
  const [finalDate, setFinalDate] = useState(Date.now());
  const [loadingChartData, setLoadingChartData] = useState(true);
  const [screenWidth, setScreenWidth] = useState("bottom");
  // chart controllers
  const [dataDisplay, setDataDisplay] = useState("TotalMoney");
  const [pageController, setPageController] = useState(0);
  const [detailsSelectorData, setDetailsSelectorData] =
    useState("productTotal");

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
  // create data for charts
  const [dataSummary, setDataSummary] = useState([]);
  const createData = () => {
    setLoadingChartData(true);
    // filter data by date
    const purchaseArray = clients.map((clientN) =>
      allInvoices.filter(
        (invoiceN) =>
          invoiceN.userId === clientN.id &&
          new Date(invoiceN.dateOfEntry) >= new Date(initialDate) &&
          new Date(invoiceN.dateOfEntry) <= new Date(finalDate)
      )
    );
    let productPrices = {};
    productsForSale.forEach((e) => (productPrices[e.name] = e.price));

    const clientsData = generateData(purchaseArray, productPrices);
    setDataSummary(clientsData);
    // generate Pie Chart
    const PieData = {
      labels: clientsData?.filter((e) => e.name !== "all").map((e) => e.name),
      datasets: [
        {
          label: "Customer purchase",
          data: clientsData
            ?.filter((e) => e.name !== "all")
            .map((e) => e[dataDisplay]),
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
    setDataForPieChart(PieData);

    // set bar chart data
    if (client) {
      try {
        const objectProductos = clientsData?.filter((e) => {
          return e.name === client;
        })[0]?.productCount;
        //console.log(objectProductos);
        // organize objectProductos
        // console.log(lables, dataBarQuantity, dataBarTotal);
        objectProductos.sort((a, b) => {
          return -a[detailsSelectorData] + b[detailsSelectorData];
        });
        const lables = objectProductos?.map((e) => e.productName);
        const dataBar = objectProductos?.map((e) => e[detailsSelectorData]);

        // frequency chart data
        const barData = {
          labels: lables, // Y-axis labels
          datasets: [
            {
              label: detailsSelectorData,
              data: dataBar, // X-axis values
              backgroundColor: "rgba(0, 123, 255, 0.5)", // Bar color
            },
          ],
        };
        //console.log(barData);
        setDataForFChart(barData);
      } catch (error) {
        console.log("no pruchases made", error);
        setDataForFChart(null);
      }
    }
    setLoadingChartData(false);
  };
  // handle changes
  useEffect(() => {
    createData();
  }, [client, detailsSelectorData, dataDisplay, initialDate, finalDate]);

  return (
    <div className="dashboardSection">
      <h1>Dashboard</h1>
      <div className="generalInfoContainer">
        <div className="chartControllerContainer">
          <h2>Customers Data</h2>
          <div className="dateSelection">
            <div>
              <label>Initial Date</label>
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
              <label>Final Date</label>
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
        </div>

        {loadingChartData ? (
          <p>loading data...</p>
        ) : (
          <div
            className="chartsContainer"
            style={{ transform: `translateX(-${pageController * 100}%)` }}
          >
            <div className="pieChartSection">
              <div className="pieChartSectionController">
                <label>Data</label>
                <select
                  value={dataDisplay}
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
              <div className="pieChart">
                <PieChart
                  dataForPieChart={dataForPieChart}
                  screenWidth={screenWidth}
                />
              </div>
            </div>
            <div className="SumaryChartSection">
              <div className="SumaryChartSectionController">
                <label>Client</label>
                <br />
                <select
                  value={client}
                  onChange={(e) => {
                    setClient(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  <option value="all">All</option>
                  {clients.map((e, i) => {
                    return (
                      <option value={e.name} key={i}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="displaySummaryInfo">
                <div>Client:{client}</div>

                <div>
                  Total Sale: $
                  {dataSummary?.filter((e) => e.name === client)[0]?.TotalMoney}
                </div>
                <div>
                  Total Discount: $
                  {
                    dataSummary?.filter((e) => e.name === client)[0]
                      ?.TotalDiscount
                  }
                </div>
                <div>
                  Total Vouchers:
                  {
                    dataSummary?.filter((e) => e.name === client)[0]
                      ?.totalPurchases
                  }
                </div>
              </div>
              <div>
                {" "}
                <LineChart />
              </div>
            </div>
            <div className="barChartSection">
              <div className="barChartSectioncontroller">
                <label>Client</label>
                <br />
                <select
                  value={client}
                  onChange={(e) => {
                    setClient(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  <option value="all">All</option>
                  {clients.map((e, i) => {
                    return (
                      <option value={e.name} key={i}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label>Type of Data</label>
                <br />
                <select
                  value={detailsSelectorData}
                  onChange={(e) => {
                    setDetailsSelectorData(e.target.value);
                  }}
                >
                  <option value="productTotal">Total</option>
                  <option value="productQuantity">Quantity</option>
                </select>
              </div>
              {client ? (
                dataForFChart?.labels?.length > 0 ? (
                  <>
                    <BarChart dataForFChart={dataForFChart} />
                  </>
                ) : (
                  <div>No Purchase Done Yet</div>
                )
              ) : (
                <div>Please Select A Client</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="pageController">
        <button
          onClick={() => {
            pageController > 0
              ? setPageController(pageController - 1)
              : setPageController(2);
          }}
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            pageController < 2
              ? setPageController(pageController + 1)
              : setPageController(0);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

// generate data
const generateData = (arr, productPrices) => {
  const response = arr
    .filter((e) => e.length > 0)
    .map((subClientN) => {
      const TotalMoney = subClientN.reduce((a, b) => {
        return a + b.total;
      }, 0);
      const TotalDiscount = subClientN.reduce((a, b) => {
        return a + (b.subtotal - b.total);
      }, 0);
      // products is an array with the object of each products and quantities purchase on each invoice
      const products = subClientN.map((e) => e.product);
      let productCount = [];
      products.forEach((subArray, i) => {
        subArray.forEach((product) => {
          // check if already exist
          if (productCount?.map((e) => e.productName).includes(product.name)) {
            // if it exist we must change it
            const indexOfRepeated = productCount
              ?.map((e) => e.productName)
              .indexOf(product.name);
            let productQuantity = productCount[indexOfRepeated].productQuantity;
            productQuantity += product.quantity;
            const miniObject = {
              productName: product.name,
              productQuantity,
            };
            productCount[indexOfRepeated] = miniObject;
          } else {
            // if it doesn't exist we must push it
            const miniObject = {
              productName: product.name,
              productQuantity: product.quantity,
            };
            productCount.push(miniObject);
          }
        });
      });
      // create totals

      productCount = productCount.map((e) => {
        return {
          ...e,
          productTotal: e.productQuantity * productPrices[e.productName],
        };
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
  //console.log("response", response);
  // calculate all
  let productsCount = [];
  response.forEach((data) => {
    // check if already exist
    data?.productCount.forEach((e) => {
      if (
        productsCount
          .map((subProductCount) => subProductCount.productName)
          .includes(e.productName)
      ) {
        // get index
        const indexOfRepeated = productsCount
          ?.map((e) => e.productName)
          .indexOf(e.productName);
        // replace data
        productsCount[indexOfRepeated] = {
          productName: e.productName,
          productTotal:
            e.productTotal + productsCount[indexOfRepeated].productTotal,
          productQuantity:
            e.productQuantity + productsCount[indexOfRepeated].productQuantity,
        };
      } else {
        productsCount.push({
          productName: e.productName,
          productTotal: e.productTotal,
          productQuantity: e.productQuantity,
        });
      }
    });
  });
  // integrate to main response array
  const totalMoneySum = response.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.TotalMoney;
  }, 0);
  const TotalDiscountSum = response.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.TotalDiscount;
  }, 0);
  const totalPurchasesSum = response.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.totalPurchases;
  }, 0);
  response.push({
    name: "all",
    userId: null,
    TotalMoney: totalMoneySum,
    TotalDiscount: TotalDiscountSum,
    totalPurchases: totalPurchasesSum,
    productCount: productsCount,
  });

  return response;
};
