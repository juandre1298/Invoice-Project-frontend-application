import { Chart, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
  const { dataForFChart } = props;
  Chart.register(CategoryScale, LinearScale, BarElement, Title);
  // Define the data for the chart
  /* const data = {
    labels: ["Label 1", "Label 2", "Label 3"], // X-axis labels
    datasets: [
      {
        label: "Data",
        data: [10, 20, 15], // Y-axis values
        backgroundColor: "rgba(0, 123, 255, 0.5)", // Bar color
      },
    ],
  }; */

  // Set the chart options
  const options = {
    /*     responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    }, */
    indexAxis: "y", // Set the index axis to 'y' for horizontal bar chart
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={dataForFChart} options={options} />;
};

export default BarChart;
