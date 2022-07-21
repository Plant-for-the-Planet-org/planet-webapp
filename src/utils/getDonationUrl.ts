// calling this function before window is loaded may cause an error
export const getDonationUrl = (id: string, token: string | null, tenantID : any): string => {
  const country = localStorage.getItem('countryCode');
  const language = localStorage.getItem('language');
  let directGift = localStorage.getItem('directGift');
  if (directGift) {
    directGift = JSON.parse(directGift);
  }
  const sourceUrl = `${
    process.env.NEXT_PUBLIC_DONATION_URL
  }/?to=${id}&callback_url=${
    window.location.href
  }&country=${country}&locale=${language}${
    token ? '&token=' + token : ''
  }&tenant=${tenantID}${directGift ? '&s=' + directGift.id : ''}`;
  return sourceUrl;
};
