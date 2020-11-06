// eslint-disable-next-line consistent-return
export default function getImageUrl(
  category: string,
  variant: string,
  imageName: any,
) {
    return `${process.env.CDN_URL}/media/cache/${category}/${variant}/${imageName}`;
}

export function getPDFFile(
  category: string,
  fileName: any,
) {
  return `${process.env.CDN_URL}/media/uploads/pdfs/${category}/${fileName}`;

}
