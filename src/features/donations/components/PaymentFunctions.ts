export function getPaymentType(paymentType: String) {
  let paymentTypeUsed;
  switch (paymentType) {
    case 'CARD':
      paymentTypeUsed = 'Credit Card';
      break;
    case 'SEPA':
      paymentTypeUsed = 'SEPA Direct Debit';
      break;
    case 'GOOGLE_PAY':
      paymentTypeUsed = 'Google Pay';
      break;
    case 'APPLE_PAY':
      paymentTypeUsed = 'Apple Pay';
      break;
    case 'BROWSER':
      paymentTypeUsed = 'Browser';
      break;
    default:
      paymentTypeUsed = 'Credit Card';
  }
  return paymentTypeUsed;
}
