// calling this function before window is loaded may cause an error
export const getDonationUrl = (
  tenant: string | undefined,
  id: string,
  token: string | null,
  embed?: string | undefined | string[],
  callbackUrl?: string | undefined | string[],
  slug?: string | undefined,
  utmCampaign?: string
): string => {
  const country = localStorage.getItem('countryCode');
  const language = localStorage.getItem('language');
  let directGift = localStorage.getItem('directGift');
  if (directGift) {
    directGift = JSON.parse(directGift);
  }

  const callback_url = embed === 'true' ? callbackUrl : window.location.href;

  const sourceUrl = `${
    process.env.NEXT_PUBLIC_DONATION_URL
  }/?to=${encodeURIComponent(id)}${
    callback_url !== undefined
      ? '&callback_url=' + encodeURIComponent(String(callback_url))
      : ''
  }&country=${encodeURIComponent(String(country))}&locale=${encodeURIComponent(
    String(language)
  )}${token ? '&token=' + encodeURIComponent(token) : ''}${
    tenant !== undefined ? '&tenant=' + encodeURIComponent(tenant) : ''
  }${
    directGift && directGift.id !== undefined
      ? '&s=' + encodeURIComponent(directGift.id)
      : slug !== undefined
      ? '&s=' + encodeURIComponent(slug)
      : ''
  }${
    utmCampaign ? '&utm_campaign=' + encodeURIComponent(utmCampaign) : ''
  }`;

  return sourceUrl;
};
