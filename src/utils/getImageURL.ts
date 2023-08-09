/**
 * Retrieves the image url.
 * @returns {string} The URL of the image.
 */

// eslint-disable-next-line consistent-return
export default function getImageUrl(
  category: string,
  variant: string,
  imageName: string
): string {
  return `${process.env.CDN_URL}/media/cache/${category}/${variant}/${imageName}`;
}

/**
 * Retrieves the pdf url.
 * @returns {string} The URL of the pdf.
 */

export function getPDFFile(category: string, fileName: string): string {
  return `${process.env.CDN_URL}/media/uploads/pdfs/${category}/${fileName}`;
}
