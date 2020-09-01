import { faCcAmex, faCcDinersClub, faCcDiscover, faCcJcb, faCcMastercard, faCcStripe, faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const getCardBrand = (brand: String) => {
  switch (brand) {
    case 'visa': return <FontAwesomeIcon size={"2x"} icon={faCcVisa} />;
    case 'mastercard': return <FontAwesomeIcon size={"2x"} icon={faCcMastercard} />;
    case 'amex': return <FontAwesomeIcon size={"2x"} icon={faCcAmex} />;
    case 'discover': return <FontAwesomeIcon size={"2x"} icon={faCcDiscover} />;
    case 'diners': return <FontAwesomeIcon size={"2x"} icon={faCcDinersClub} />;
    case 'jcb': return <FontAwesomeIcon size={"2x"} icon={faCcJcb} />;
    case 'unionpay': return <FontAwesomeIcon size={"2x"} icon={faCcStripe} />;
    case 'unknown': return <FontAwesomeIcon size={"2x"} icon={faCcStripe} />;
    default: return <FontAwesomeIcon size={"2x"} icon={faCcStripe} />;
  }
}