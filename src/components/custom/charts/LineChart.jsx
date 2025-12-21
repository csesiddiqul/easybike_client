
import Chart from "react-apexcharts";

const LineChart = () => {
  // Prepare data for the chart

  const chartOptions = {
    chart: {
      type: "line",
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [],
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Quantity",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetX: 0,
    },
    fill: {
      opacity: 1,
    },
  };

  const chartSeries = [
    {
      name: "Stock Quantity",
      data: [],
    },
    {
      name: "Distribution Quantity",
      data: [],
    },
    {
      name: "Remaining Quantity",
      data: [],
    },
    {
      name: "Damaged Expired",
      data: [],
    },
    {
      name: "Damaged Quantity",
      data: [],
    },
  ];

  return (
    <div className="line-chart">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        width="100%"
        height={300}
      />
    </div>
  );
};

export default LineChart;
