import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcStripe,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons';
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
    case 'visa':
      return <FontAwesomeIcon icon={faCcVisa} />;
    case 'mastercard':
      return <FontAwesomeIcon icon={faCcMastercard} />;
    case 'amex':
      return <FontAwesomeIcon icon={faCcAmex} />;
    case 'discover':
      return <FontAwesomeIcon icon={faCcDiscover} />;
    case 'diners':
      return <FontAwesomeIcon icon={faCcDinersClub} />;
    case 'jcb':
      return <FontAwesomeIcon icon={faCcJcb} />;
    case 'unionpay':
      return <FontAwesomeIcon icon={faCcStripe} />;
    case 'unknown':
      return <FontAwesomeIcon icon={faCcStripe} />;
    default:
      return <FontAwesomeIcon icon={faCcStripe} />;
  }
};
