import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

export const PieChart = (dataForChart) => {
  return (
    <>
      <Pie
        className="pie"
        // Set the desired width of the pie chart
        data={dataForChart}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              display: true, // Change the position of the legend
            },
          },
        }}
      />
    </>
  );
};
