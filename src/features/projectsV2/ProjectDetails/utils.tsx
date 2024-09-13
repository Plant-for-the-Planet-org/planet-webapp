import { SamplePlantLocation } from '../../common/types/plantLocation';

interface ImageData {
  image: string;
}
export const extractImages = (
  sampleInterventionsImages: SamplePlantLocation[]
) => {
  const Images: ImageData[] = [];
  function traverse(data: any) {
    if (Array.isArray(data)) {
      data.forEach(traverse);
    } else if (typeof data === 'object' && data !== null) {
      if (data.image) {
        Images.push({ image: data.image });
      }
      Object.values(data).forEach(traverse);
    }
  }
  traverse(sampleInterventionsImages);
  return Images;
};
