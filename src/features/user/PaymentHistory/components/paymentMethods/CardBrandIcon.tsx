import {
  Amex,
  Diners,
  Discover,
  Generic,
  JCB,
  Maestro,
  Mastercard,
  UnionPay,
  Visa,
} from 'react-svg-credit-card-payment-icons/icons/flat';

const SIZE = { width: 32, height: 20 } as const;

/** Maps Stripe's `card.brand` to the brand's mark. Copied from the fundraisers app. */
export const CardBrandIcon = ({ brand }: { brand: string | null }) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return <Visa {...SIZE} />;
    case 'mastercard':
      return <Mastercard {...SIZE} />;
    case 'amex':
    case 'american_express':
    case 'american-express':
      return <Amex {...SIZE} />;
    case 'discover':
      return <Discover {...SIZE} />;
    case 'diners':
    case 'diners_club':
      return <Diners {...SIZE} />;
    case 'jcb':
      return <JCB {...SIZE} />;
    case 'unionpay':
    case 'union_pay':
      return <UnionPay {...SIZE} />;
    case 'maestro':
      return <Maestro {...SIZE} />;
    // Stripe also returns brands without a mark of their own, such as `eftpos_au`.
    default:
      return <Generic {...SIZE} />;
  }
};
