export const formatAddress = (
  address: string | undefined,
  zipCode: string | undefined,
  city: string | undefined,
  state: string | null,
  country: string
) => {
  const cleanAddress = [address, `${zipCode} ${city}`, state, country]
    .filter(Boolean)
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanAddress;
};

export const validationPattern = {
  address: /^[\p{L}\p{N}\sß.,#/-]+$/u,
  cityState: /^[\p{L}\sß.,()-]+$/u,
};
