import Tabs from '../VegetationChange/Tabs';
export default {
  component: Tabs,
  title: 'VegetationChangeTabs',
};

const Template = (args) => <Tabs {...args} />;

export const FieldDataSelected = Template.bind({});

FieldDataSelected.args = {
  selectedMode: 'field',
};

export const SatelliteAnalysisSelected = Template.bind({});

SatelliteAnalysisSelected.args = {
  selectedMode: 'satellite',
};
export const TimeTravelSelected = Template.bind({});

TimeTravelSelected.args = {
  selectedMode: 'timeTravel',
};
