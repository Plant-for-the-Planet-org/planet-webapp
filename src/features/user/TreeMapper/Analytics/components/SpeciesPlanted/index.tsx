import dynamic from 'next/dynamic';
import { useState } from 'react';
import themeProperties from '../../../../../../theme/themeProperties';
import data from '../../speciesPlantedMockData.json';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const treeCountBySpecies = {};

for (const item of data) {
  const { scientific_species_id, name, tree_count } = item;

  if (!treeCountBySpecies[scientific_species_id]) {
    treeCountBySpecies[scientific_species_id] = { name, tree_count: 0 };
  }

  treeCountBySpecies[scientific_species_id].tree_count += parseInt(tree_count);
}

const result = Object.entries(treeCountBySpecies)
  .map(([scientific_species_id, { name, tree_count }]) => ({
    scientific_species_id,
    name,
    tree_count,
  }))
  .sort((a, b) => b.tree_count - a.tree_count);

const species = [];
const species_num = [];

Object.entries(result).map((s) => {
  species.push(s[1].name);
  species_num.push(s[1].tree_count);
});

// const counts = {};

// for (let i = 0; i < data.length; i++) {
//   const item = data[i];
//   const id = item.scientific_species_id;
//   const count = parseInt(item.tree_count, 10);

//   if (id && !isNaN(count)) {
//     if (counts[id]) {
//       counts[id] += count;
//     } else {
//       counts[id] = count;
//     }
//   }
// }

// // create an array of objects from the counts object
// const results = Object.keys(counts).map((id) => ({
//   scientific_species_id: id,
//   tree_count: counts[id],

// }));

// // sort the results array in descending order of tree_count
// results.sort((a, b) => b.tree_count - a.tree_count);

// console.log(result);

export const SpeciesPlanted = () => {
  const [series, setSeries] = useState([
    {
      data: species_num || [],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          download: true,
        },
        offsetY: -15,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },

    fill: {
      colors: themeProperties.primaryColor,
    },

    xaxis: {
      categories: species,
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      tickPlacement: 'on',
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val;
        },
      },
    },
  });

  return (
    <>
      <p>Species Graph</p>
      <ReactApexChart options={options} series={series} type="bar" />
    </>
  );
};
