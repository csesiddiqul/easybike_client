
import Chart from "react-apexcharts";

const BarChart = () => {


  const chartOptions = {
    chart: {
      type: "bar",
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
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
  ];

  return (
    <div className="bar-chart">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        width="100%"
        height={300}
      />
    </div>
  );
};

export default BarChart;
