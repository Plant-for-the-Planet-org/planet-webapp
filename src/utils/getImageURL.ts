export const getImageUrl = (
  category: string,
  variant: string,
  imageName: any
) => {
  // if(typeof(Storage) !== "undefined"){
  //     let configStore;
  //     configStore = localStorage.getItem('config');
  //     configStore  = configStore ? JSON.parse(configStore) : null;
  //     if(configStore !== null && typeof configStore.cdnMedia !== 'undefined'){
  //         const cacheURl = configStore.cdnMedia.cache;
  //         return `${cacheURl}/${category}/${variant}/${imageName}`;
  //     }
  //  }
  const cacheURL =
    'https://bucketeer-894cef84-0684-47b5-a5e7-917b8655836a.s3.eu-west-1.amazonaws.com/development/media/cache';
  return `${cacheURL}/${category}/${variant}/${imageName}`;
};
