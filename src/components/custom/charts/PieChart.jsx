import React from "react";
import Chart from "react-apexcharts";

const PieChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: [
      "Distribution",
      "Remaining",
      "Expired",
      "Damaged",
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = [data?.distribution_percentage, data?.remaining_percentage, data?.expired_quantity, data?.damaged_quantity];

  return (
    <div className="pie-chart">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        width="380"
      />
    </div>
  );
};

export default PieChart;
