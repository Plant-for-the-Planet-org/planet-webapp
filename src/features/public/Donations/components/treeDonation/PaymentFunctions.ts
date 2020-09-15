export async function createDonation(data: any) {
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
    },
  });
  const donation = await res.json();
  return donation;
}

export async function payDonation(data: any, id: any) {
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
    },
  });
  const contribution = await res.json();
  return contribution;
}

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
