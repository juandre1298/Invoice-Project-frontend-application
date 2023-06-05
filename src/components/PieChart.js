import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

export const PieChart = (props) => {
  const { dataForPieChart, screenWidth } = props;
  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <Pie
      // Set the desired width of the pie chart
      data={dataForPieChart}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: screenWidth,
            display: true,
            labels: {
              usePointStyle: true, // Enable label overlap detection
              font: {
                size: 10, // Adjust the font size as needed
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                // Adjust the label display as per your requirements
                return context.label + ": " + context.raw;
              },
            },
            bodyFont: {
              size: 10, // Adjust the font size for tooltip labels
            },
          },
        },
      }}
    />
  );
};
