import AmexIcon from '../assets/images/icons/CreditCardIcons/AmexIcon';
import DinersClub from '../assets/images/icons/CreditCardIcons/DinersClub';
import DiscoverIcon from '../assets/images/icons/CreditCardIcons/DiscoverIcon';
import JcbIcon from '../assets/images/icons/CreditCardIcons/JcbIcon';
import Mastercard from '../assets/images/icons/CreditCardIcons/Mastercard';
import StripeIcon from '../assets/images/icons/CreditCardIcons/StripeIcon';
import VisaIcon from '../assets/images/icons/CreditCardIcons/VisaIcon';

export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;

  // https://gist.github.com/ljharb/58faf1cfcb4e6808f74aae4ef7944cff
  // for (const part of parts) {
  //   if (part.type === 'decimal') {
  //     zeroDecimalCurrency = false;
  //   }
  // }

  parts.forEach((part) => {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  });
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export const getCardBrand = (brand: String) => {
  switch (brand) {
    case 'visa':
      return <VisaIcon />;
    case 'mastercard':
      return <Mastercard />;
    case 'amex':
      return <AmexIcon />;
    case 'discover':
      return <DiscoverIcon />;
    case 'diners':
      return <DinersClub />;
    case 'jcb':
      return <JcbIcon />;
    case 'unionpay':
      return <StripeIcon />;
    case 'unknown':
      return <StripeIcon />;
    default:
      return <StripeIcon />;
  }
};
