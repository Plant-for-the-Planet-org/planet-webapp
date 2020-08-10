export const getImageUrl = (
  category: string,
  variant: string,
  imageName: any
) => {
  if (process.env.CDN_URL) {
    const cacheURl = process.env.CDN_URL;
    return `${cacheURl}/${category}/${variant}/${imageName}`;
  } else if (typeof Storage !== 'undefined') {
    let configStore;
    configStore = localStorage.getItem('config');
    configStore = configStore ? JSON.parse(configStore) : null;
    if (configStore !== null && typeof configStore.cdnMedia !== 'undefined') {
      const cacheURl = configStore.cdnMedia.cache;
      return `${cacheURl}/${category}/${variant}/${imageName}`;
    }
  }
};
