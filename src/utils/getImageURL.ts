// eslint-disable-next-line consistent-return
export default function getImageUrl(
  category: string,
  variant: string,
  imageName: any,
) {
  if (process.env.CDN_URL) {
    const cdnURl = process.env.CDN_URL;
    const cacheURl = 'media/cache';
    return `${cdnURl}/${cacheURl}/${category}/${variant}/${imageName}`;
  } if (typeof Storage !== 'undefined') {
    let configStore;
    configStore = localStorage.getItem('config');
    configStore = configStore ? JSON.parse(configStore) : null;
    if (configStore !== null && typeof configStore.cdnMedia !== 'undefined') {
      const cacheURl = configStore.cdnMedia.cache;
      return `${cacheURl}/${category}/${variant}/${imageName}`;
    }
  }
}

export function getS3Image(
  category: string,
  variant: string,
  imageName: any,
) {
  const cdnURl = 'https://bucketeer-894cef84-0684-47b5-a5e7-917b8655836a.s3.eu-west-1.amazonaws.com/development';
  const cacheURl = 'media/cache';
  return `${cdnURl}/${cacheURl}/${category}/${variant}/${imageName}`;
}