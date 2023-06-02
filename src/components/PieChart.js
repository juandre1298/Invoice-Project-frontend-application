import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

export const PieChart = (props) => {
  const { dataForPieChart, screenWidth } = props;
  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <Pie
      className="pie"
      // Set the desired width of the pie chart
      data={dataForPieChart}
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
  );
};
