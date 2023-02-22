import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import themeProperties from '../../../../../../theme/themeProperties';
import { getFormattedNumber } from '../../../../../../utils/getFormattedNumber';
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

export const SpeciesPlanted = () => {
  const { i18n } = useTranslation();

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
        borderRadius: 2,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return getFormattedNumber(i18n.language, val);
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
      labels: {
        rotate: -90,
      },
      categories: species,
      position: 'bottom',
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
          return getFormattedNumber(i18n.language, val);
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
