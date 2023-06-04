import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const LineChart = (props) => {
  const { dataForLineChart, options } = props;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  // Sample data for the chart

  // Configuration options for the chart

  return (
    <Line
      data={dataForLineChart}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0, // Set the tension to 0 for straight lines
          },
        },

        scales: {
          y: {
            beginAtZero: true,
            position: "left",
          },
          y1: {
            beginAtZero: true,
            position: "right",
          },
        },
      }}
    />
  );
};

export default LineChart;
