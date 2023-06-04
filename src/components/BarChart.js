import { Chart, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
  const { dataForFChart } = props;
  Chart.register(CategoryScale, LinearScale, BarElement, Title);

  // Set the chart options
  const options = {
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
