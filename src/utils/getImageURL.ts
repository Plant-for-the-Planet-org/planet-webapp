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
    if (configStore && typeof configStore.cdnMedia !== 'undefined') {
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
  const cacheURl = 'media/cache';
  return `${process.env.CDN_URL}/${cacheURl}/${category}/${variant}/${imageName}`;

}


export function getPDFFile(
  category: string,
  fileName: any,
) {
  return `${process.env.CDN_URL}/media/uploads/pdfs/${category}/${fileName}`;

}
