import { useState } from 'react';
import { MapOptions } from '../../ProjectsMapContext';
import MapFeatureExplorer from '../MapFeatureExplorer';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MapFeatureExplorer> = {
  title: 'Projects/Landing/MapFeatureExplorer',
  component: MapFeatureExplorer,
};

export default meta;
type Story = StoryObj<typeof MapFeatureExplorer>;

const MapFeatureExplorerWrapper = () => {
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    showProjects: true,
  });

  const updateMapOption = (option: keyof MapOptions, value: boolean) => {
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  return (
    <MapFeatureExplorer
      mapOptions={mapOptions}
      updateMapOption={updateMapOption}
    />
  );
};

export const Default: Story = {
  render: () => <MapFeatureExplorerWrapper />,
};
