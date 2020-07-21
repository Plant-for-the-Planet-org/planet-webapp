import useLocalStorage from "./useLocalStorage";
import { context } from "./config";

export const getImageUrl = (category:string, variant:string, imageName:any) => {
    const [configStore, setConfig] = useLocalStorage('config',{});
    if(configStore !== null && typeof configStore.cdnMedia !== 'undefined'){
        const cacheURl = configStore.cdnMedia.cache;
        return `${cacheURl}/${category}/${variant}/${imageName}`;
    }
};