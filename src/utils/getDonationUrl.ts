// calling this function before window is loaded may cause an error
export const getDonationUrl = (
  id: string,
  token: string | null,
  embed?: string | undefined,
  callbackUrl?: string | undefined
): string => {
  const country = localStorage.getItem('countryCode');
  const language = localStorage.getItem('language');
  let directGift = localStorage.getItem('directGift');
  if (directGift) {
    directGift = JSON.parse(directGift);
  }
  const sourceUrl =
    embed === 'true'
      ? `${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${id}&embed=${embed}&${
          callbackUrl != undefined ? `callback_url=${callbackUrl}` : ''
        }&country=${country}&locale=${language}${
          token ? '&token=' + token : ''
        }&tenant=${process.env.TENANTID}${
          directGift ? '&s=' + directGift.id : ''
        }`
      : `${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${id}&callback_url=${
          window.location.href
        }&country=${country}&locale=${language}${
          token ? '&token=' + token : ''
        }&tenant=${process.env.TENANTID}${
          directGift ? '&s=' + directGift.id : ''
        }`;
  return sourceUrl;
};
