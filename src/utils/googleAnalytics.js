import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};
