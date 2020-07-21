import useLocalStorage from "./useLocalStorage";

export const getImageUrl = (category:string, variant:string, imageName:any) => {
    const [configStore, setConfig] = useLocalStorage('config',{});
    const cacheURl = configStore.cdnMedia.cache;
    return `${cacheURl}/${category}/${variant}/${imageName}`;
};