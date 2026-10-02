type DonationUrlOptions = {
  tenant?: string;
  /** Project slug, or 'planetcash' to top up a PlanetCash balance. */
  target: string;
  token?: string | null;
  embed?: string;
  callbackUrl?: string;
  /** Direct-gift recipient slug, used for the `s` param. */
  recipientSlug?: string;
  utmCampaign?: string;
};

// calling this function before window is loaded may cause an error
export const getDonationUrl = (options: DonationUrlOptions): string => {
  const {
    tenant,
    target,
    token,
    embed,
    callbackUrl,
    recipientSlug,
    utmCampaign,
  } = options;

  const country = localStorage.getItem('countryCode') || 'DE';
  const language = localStorage.getItem('language') || 'en';

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

  // directGift.id, when present, takes precedence over recipientSlug for the 's' param
  const giftSlug =
    directGift && directGift.id !== undefined ? directGift.id : recipientSlug;

  const queryParams = [
    `to=${encodeURIComponent(target)}`,
    callbackUrlValue !== undefined
      ? `callback_url=${encodeURIComponent(callbackUrlValue)}`
      : undefined,
    `country=${encodeURIComponent(country)}`,
    `locale=${encodeURIComponent(language)}`,
    token ? `token=${encodeURIComponent(token)}` : undefined,
    tenant !== undefined ? `tenant=${encodeURIComponent(tenant)}` : undefined,
    giftSlug !== undefined ? `s=${encodeURIComponent(giftSlug)}` : undefined,
    utmCampaign ? `utm_campaign=${encodeURIComponent(utmCampaign)}` : undefined,
  ].filter((param): param is string => param !== undefined);

  return `${process.env.NEXT_PUBLIC_DONATION_URL}/?${queryParams.join('&')}`;
};
