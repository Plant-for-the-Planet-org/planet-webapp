export const useMobileDetection = (
  maxWidth: number,
  callback: (value: boolean) => void
) => {
  const mediaQuery = window.matchMedia(`(max-width:${maxWidth} )`);

  const handleResize = () => {
    callback(mediaQuery.matches);
  };
  handleResize();
  mediaQuery.addEventListener('change', handleResize);
  return () => {
    mediaQuery.removeEventListener('change', handleResize);
  };
};
