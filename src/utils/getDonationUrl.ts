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

  const storedDirectGift = localStorage.getItem('directGift');
  let directGift: { id?: string } | null = null;
  if (storedDirectGift) {
    try {
      directGift = JSON.parse(storedDirectGift);
    } catch {
      directGift = null;
    }
  }

  const callbackUrlValue =
    embed === 'true' ? callbackUrl : window.location.href;

  // directGift.id, when present, takes precedence over slug for the 's' param
  const giftSlug =
    directGift && directGift.id !== undefined ? directGift.id : slug;

  const queryParams = [
    `to=${encodeURIComponent(id)}`,
    callbackUrlValue !== undefined
      ? `callback_url=${encodeURIComponent(String(callbackUrlValue))}`
      : undefined,
    `country=${encodeURIComponent(String(country))}`,
    `locale=${encodeURIComponent(String(language))}`,
    token ? `token=${encodeURIComponent(token)}` : undefined,
    tenant !== undefined ? `tenant=${encodeURIComponent(tenant)}` : undefined,
    giftSlug !== undefined ? `s=${encodeURIComponent(giftSlug)}` : undefined,
    utmCampaign
      ? `utm_campaign=${encodeURIComponent(utmCampaign)}`
      : undefined,
  ].filter((param): param is string => param !== undefined);

  return `${process.env.NEXT_PUBLIC_DONATION_URL}/?${queryParams.join('&')}`;
};
