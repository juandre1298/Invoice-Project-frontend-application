import { Chart, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
  const { dataForFChart, screenWidth } = props;
  Chart.register(CategoryScale, LinearScale, BarElement, Title);

  // Set the chart options
  let options;
  // Set the chart options
  if (screenWidth >= 1024 || screenWidth < 760) {
    options = {
      maintainAspectRatio: false,
      indexAxis: "y", // Set the index axis to 'y' for horizontal bar chart
      scales: {
        x: {
          display: true, // Hide the x-axis label
          beginAtZero: true,
          position: "top", // Display x-axis scale on top
        },
        y: {
          beginAtZero: true,
          ticks: {
            autoSkip: false, // Display all labels on the y-axis
          },
          maxBarThickness: 100, // Adjust the maximum thickness of the bars if needed
          // Set the maximum value for the y-axis if needed
          min: 0, // Set the minimum value for the y-axis if needed
        },
      },
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      },
    };
  } else if (screenWidth < 1024) {
    options = {
      maintainAspectRatio: false,
      indexAxis: "x", // Set the index axis to 'y' for horizontal bar chart
      scales: {
        x: {
          display: true, // Hide the x-axis label
          beginAtZero: true,
          position: "bottom", // Display x-axis scale on top
        },
        y: {
          beginAtZero: true,
          ticks: {
            autoSkip: false, // Display all labels on the y-axis
          },
          maxBarThickness: 100, // Adjust the maximum thickness of the bars if needed
          // Set the maximum value for the y-axis if needed
          min: 0, // Set the minimum value for the y-axis if needed
        },
      },
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      },
    };
  }
  /*    */

  return <Bar data={dataForFChart} options={options} />;
};

export default BarChart;
