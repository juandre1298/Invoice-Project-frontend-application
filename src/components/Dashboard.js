import react, { useContext, useState, useRef, useEffect } from "react";

import MyContext from "../contexts/userContext";
// import Chart

import { PieChart } from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

// import from api
import { getUsers, getProducts, getDashboardData } from "../api/api";

export const InvoiceDashboard = (props) => {
  const { allInvoices } = props;
  const { globalUser } = useContext(MyContext);
  // states
  // state options
  const [client, setClient] = useState("all");
  const [productsForSale, setProductsForSale] = useState([]);
  const [initialDate, setInitialDate] = useState(0);
  const [finalDate, setFinalDate] = useState(Date.now());

  const [clients, setClients] = useState([]);
  // chart states
  const [dataForPieChart, setDataForPieChart] = useState([]);
  const [dataForFChart, setDataForFChart] = useState({
    labels: [], // Y-axis labels
    datasets: [],
  });
  const [dataForLineChart, setDataForLineChart] = useState({
    labels: [],
    datasets: [],
  });

  const [loadingChartData, setLoadingChartData] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  // chart controllers
  const [dataDisplay, setDataDisplay] = useState("TotalMoney");
  const [pageController, setPageController] = useState(0);
  const [detailsSelectorData, setDetailsSelectorData] =
    useState("productTotal");
  // calculate width
  const chartInstance = useRef(null);
  useEffect(() => {
    const updateChartOptions = () => {
      const screenWidthT = window.innerWidth;
      if (screenWidth < 1024) {
        setPageController(0);
      }
      setScreenWidth(screenWidthT);
      if (chartInstance.current) {
        chartInstance.current.options.plugins.legend.position = screenWidthT;
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
  // get clients and products and generate dataForChart
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

  useEffect(() => {
    getUsersFromApi().then(() => {
      getProductsFromApi().then(() => {
        fetchDashboardData({
          userId: globalUser.id,
          client,
          detailsSelectorData,
          dataDisplay,
          initialDate,
          finalDate,
        });
      });
    });
  }, [allInvoices]);

  // create data for charts
  const [dataSummary, setDataSummary] = useState([]);
  // const createData = () => {
  //   setLoadingChartData(true);
  //   // filter data by date
  //   const invoiceInRange = allInvoices.filter(
  //     (invoiceN) =>
  //       new Date(invoiceN.dateOfEntry) >= new Date(initialDate) &&
  //       new Date(invoiceN.dateOfEntry) <= new Date(finalDate)
  //   );
  //   const purchaseArray = clients.map((clientN) =>
  //     invoiceInRange.filter((invoiceN) => invoiceN.userId === clientN.id)
  //   );
  //   let productPrices = {};
  //   productsForSale.forEach((e) => (productPrices[e.name] = e.price));

  //   const clientsData = generateData(purchaseArray, productPrices);
  //   setDataSummary(clientsData);
  //   // generate Pie Chart
  //   const PieData = {
  //     labels: clientsData?.filter((e) => e.name !== "all").map((e) => e.name),
  //     datasets: [
  //       {
  //         label: "Customer purchase",
  //         data: clientsData
  //           ?.filter((e) => e.name !== "all")
  //           .map((e) => e[dataDisplay]),
  //         backgroundColor: [
  //           "rgba(0, 51, 204, 0.5)", // Deep blue
  //           "rgba(51, 102, 255, 0.5)", // Medium blue
  //           "rgba(102, 153, 255, 0.5)", // Light blue
  //           "rgba(128, 128, 128, 0.5)", // Medium gray
  //           "rgba(192, 192, 192, 0.5)", // Light gray
  //           "rgba(224, 224, 224, 0.5)", // Very light gray
  //           "rgba(147, 112, 219, 0.5)", // Medium purple
  //           "rgba(218, 112, 214, 0.5)", // Orchid
  //           "rgba(138, 43, 226, 0.5)", // Blue violet
  //           "rgba(0, 0, 0, 0.5)", // Black
  //           "rgba(32, 32, 32, 0.5)", // Dark gray
  //         ],
  //         borderColor: [
  //           "rgba(0, 51, 204, 1)", // Deep blue
  //           "rgba(51, 102, 255, 1)", // Medium blue
  //           "rgba(102, 153, 255, 1)", // Light blue
  //           "rgba(128, 128, 128, 1)", // Medium gray
  //           "rgba(192, 192, 192, 1)", // Light gray
  //           "rgba(224, 224, 224, 1)", // Very light gray
  //           "rgba(147, 112, 219, 1)", // Medium purple
  //           "rgba(218, 112, 214, 1)", // Orchid
  //           "rgba(138, 43, 226, 1)", // Blue violet
  //           "rgba(0, 0, 0, 1)", // Black
  //           "rgba(32, 32, 32, 1)", // Dark gray
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  //   console.log();
  //   setDataForPieChart(PieData);

  //   if (client) {
  //     try {
  //       // generate Line chart data
  //       const [labelsLineChart, totals, discounts, numberOfProducts, sales] =
  //         generateDataLine(invoiceInRange, client);
  //       const dataLineChart = {
  //         labels: labelsLineChart,
  //         datasets: [
  //           {
  //             label: "Totals",
  //             yAxisID: "y",
  //             data: totals,
  //             fill: true,
  //             backgroundColor: "#0fc9e7",
  //             borderColor: "rgba(75,192,192,1)",
  //           },
  //           {
  //             label: "Discounts",
  //             yAxisID: "y",
  //             data: discounts,
  //             fill: false,
  //             borderColor: "rgba(51,102,255,1)",
  //           },
  //           {
  //             label: "Number Of Products",
  //             yAxisID: "y1",
  //             data: numberOfProducts,
  //             fill: false,
  //             borderColor: "rgba(75,75,75,1)", // Dark gray color
  //             borderDash: [5, 5], // Set the border dash pattern for "Number Of Products"
  //           },
  //           {
  //             label: "Sales",
  //             yAxisID: "y1",
  //             data: sales,
  //             fill: false,
  //             borderColor: "black",
  //             borderDash: [5, 5], // Set the border dash pattern for "Sales"
  //           },
  //         ],
  //       };
  //       setDataForLineChart(dataLineChart);
  //       // frequency chart data

  //       const objectProductos = clientsData?.filter((e) => {
  //         return e.name === client;
  //       })[0]?.productCount;

  //       objectProductos.sort((a, b) => {
  //         return -a[detailsSelectorData] + b[detailsSelectorData];
  //       });
  //       const labels = objectProductos?.map((e) => e.productName);
  //       const dataBar = objectProductos?.map((e) => e[detailsSelectorData]);

  //       const barData = {
  //         labels: labels, // Y-axis labels
  //         datasets: [
  //           {
  //             label: detailsSelectorData,
  //             data: dataBar, // X-axis values
  //             backgroundColor: "rgba(0, 123, 255, 0.5)", // Bar color
  //           },
  //         ],
  //       };

  //       setDataForFChart(barData);
  //     } catch (error) {
  //       console.error("no pruchases made", error);
  //       setDataForFChart(null);
  //     }
  //   }
  //   // calculate with
  //   setLoadingChartData(false);
  // };

  const fetchDashboardData = async (options) => {
    try {
      console.log("options to get data:", options);
      setLoadingChartData(true);
      const chartData = await getDashboardData(options);
      console.log("chart data:", chartData);
      // set pie chart
      const pieChartData = generatePieChart(
        chartData.pieChartData.labels,
        chartData.pieChartData.values
      );
      setDataForPieChart(pieChartData);
      setLoadingChartData(false);
    } catch (error) {
      console.error(error);
    }
  };

  const generatePieChart = (labels, values) => {
    return {
      labels,
      datasets: [
        {
          label: "Customer purchase",
          data: values,
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
  };

  // handle changes
  useEffect(() => {
    // createData();
    fetchDashboardData({
      userId: globalUser.id,
      client,
      detailsSelectorData,
      dataDisplay,
      initialDate,
      finalDate,
    });
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
            <div className="subChartContainer1">
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
                    screenWidth={
                      screenWidth < 1024
                        ? screenWidth < 740
                          ? "top"
                          : "right"
                        : "bottom"
                    }
                  />
                </div>
              </div>
              <div className="SumaryChartSection">
                {globalUser.role === "admin" && (
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
                )}
                <div className="displaySummaryInfo">
                  {globalUser.role === "admin" && <div>Client:{client}</div>}

                  <div>
                    Total Sale: $
                    {
                      dataSummary?.filter((e) => e.name === client)[0]
                        ?.TotalMoney
                    }
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
                <div className="lineChart">
                  <LineChart dataForLineChart={dataForLineChart} />
                </div>
              </div>
            </div>
            <div className="barChartSection">
              {globalUser.role === "admin" && (
                <div className="barChartSectionControllerClient">
                  <label>Client</label>
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
              )}
              <div className="barChartSectionControllerData">
                <label>Data</label>

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
              <div className="barChart">
                {client ? (
                  dataForFChart?.labels?.length > 0 ? (
                    <BarChart
                      dataForFChart={dataForFChart}
                      screenWidth={screenWidth}
                    />
                  ) : (
                    <div>No Purchase Done Yet</div>
                  )
                ) : (
                  <div>Please Select A Client</div>
                )}
              </div>
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
      if (products) {
        products.forEach((subArray) => {
          if (subArray) {
            subArray.forEach((product) => {
              // check if already exist
              if (
                productCount?.map((e) => e.productName).includes(product.name)
              ) {
                // if it exist we must change it
                const indexOfRepeated = productCount
                  ?.map((e) => e.productName)
                  .indexOf(product.name);
                let productQuantity =
                  productCount[indexOfRepeated].productQuantity;
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
          }
        });
      }
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
const generateDataLine = (arr, client) => {
  let newArr = [...arr];
  if (client != "all") {
    newArr = arr.filter((e) => {
      return e.userName === client;
    });
  }

  const labels = [];
  const totals = [];
  const numberOfProducts = [];
  const discounts = [];
  const sales = [];
  newArr.forEach((e) => {
    let monthN = new Date(e.dateOfEntry).toLocaleString("default", {
      month: "short",
    });

    if (!labels.includes(monthN)) {
      // generate labels
      labels.push(monthN);
      // generate Totals
      totals.push(e.total);
      // generate discounts
      discounts.push(-e.total + e.subtotal);
      // generate Number of products sells
      numberOfProducts.push(e.product.length);
      // generate N of Sales
      sales.push(1);
    } else {
      // get index
      const indexInlabels = labels.indexOf(monthN);
      // add to totals
      totals[indexInlabels] = totals[indexInlabels] + e.total;
      // add discounts
      discounts[indexInlabels] =
        discounts[indexInlabels] - e.total + e.subtotal;
      // add Number of products sells
      numberOfProducts[indexInlabels] =
        numberOfProducts[indexInlabels] + e.product.length;
      // generate N of Sales
      sales[indexInlabels]++;
    }
  });

  return [labels, totals, discounts, numberOfProducts, sales];
};
