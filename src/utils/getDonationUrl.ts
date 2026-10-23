import { readStoredDirectGift } from './directGift';

// calling this function before window is loaded may cause an error
export const getDonationUrl = (
  tenant: string | undefined,
  id: string,
  token: string | null,
  embed?: string,
  callbackUrl?: string,
  slug?: string,
  utmCampaign?: string
): string => {
  const country = localStorage.getItem('countryCode') || 'DE';
  // Legacy compatibility read, kept until the donation widget URL is migrated off localStorage.language (see issue #3234).
  const language = localStorage.getItem('language') || 'en';

  const directGift = readStoredDirectGift();

  const callbackUrlValue =
    embed === 'true' ? callbackUrl : window.location.href;

  // A stored direct gift takes precedence over slug for the 's' param
  const giftSlug = directGift !== null ? directGift.id : slug;

  const queryParams = [
    `to=${encodeURIComponent(id)}`,
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
