import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Graph = ({ graphData }) => {
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={graphData.options}
          series={graphData.series}
          type="area"
          height={153}
          width={299}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Graph;
