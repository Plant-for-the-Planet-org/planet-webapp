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
  const cdnURl = 'https://bucketeer-894cef84-0684-47b5-a5e7-917b8655836a.s3.eu-west-1.amazonaws.com/development';
  const cacheURl = 'media/cache';
  return `${cdnURl}/${cacheURl}/${category}/${variant}/${imageName}`;
}

export function getPDFFile(
  category: string,
  fileName: any,
) {
  const cdnURl = 'https://bucketeer-894cef84-0684-47b5-a5e7-917b8655836a.s3.eu-west-1.amazonaws.com/development/media/uploads/pdfs';
  return `${cdnURl}/${category}/${fileName}`;
}

export async function mapboxImage() {
  const imageUrl = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/65.8321,23.3851,0,0/728x362@2x?access_token=${process.env.MAPBOXGL_ACCESS_TOKEN}`);
  // console.log(imageUrl.url);
  return imageUrl.url;
  // https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.0786,42.6684,0,0/300x200@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN
}

export function getComponentImage() {
  const image = localStorage.getItem('image');
  console.log(image);
  return image;
}
