import type { Meta, StoryObj } from '@storybook/react';
import AboutProject from '../components/AboutProject';

const meta: Meta<typeof AboutProject> = {
  title: 'Projects/Details/AboutProject',
  component: AboutProject,
};

export default meta;
type Story = StoryObj<typeof AboutProject>;

export const Preview: Story = {
  args: {
    wordCount: 63,
    description:
      'The Bulindi Chimpanzee & Community Project (BCCP) is a grassroots conservation initiative dedicated to conserving critically threatened wild chimpanzees and promoting environmental conservation throughout the 1000 km2 mosaic landscape between the Budongo and Bugoma Forest Reserves in western Uganda. This region is known as the ‘Budongo-Bugoma corridor’ (BBC) and is recognized by the IUCN as a ‘Chimpanzee Conservation Unit’, owing to its 300 chimpanzees living on private land. Since the 1990s, most unprotected forest throughout BBC was cleared by landowners for farming, negatively impacting climate, water and biodiversity, including the endangered chimpanzees.\r\nBCCP’s mission is to:\r\n(i) Conserve wild chimpanzees living in unprotected habitat in the BBC, and restore and enrich habitats for chimpanzees and other wildlife;\r\n(i) Support local residents to develop livelihood alternatives to deforestation and increase their capacity to engage in environmental conservation, replant forests, and accommodate chimpanzees in their environment.\r\nSince 2017, BCCP has raised over 4.5 million trees in our tree nurseries for planting by over 3000 landowners in 200+ villages. Our experienced and qualified team or foresters and agriculturalists provide training to farmers, and carry out land checks, evaluation and long-term follow up. \r\nOur goal for 2022-2025 is to raise 3,750,000 seedlings to ensure 3 million surviving trees (target: 75% survival), comprising 3 kinds of seedlings: 2,500,000 indigenous forest species for restoration, enrichment, and shade in agroforestry; 625,000 fast-growing species for woodlots, providing residents with an alternative wood source (reducing dependence on natural forest for energy, construction and timber sales, allowing natural regeneration); and 625,000 high-quality coffee as an environmentally-friendly alternative livelihood, further enhancing local capacity for conservation.',
  },
};
