export interface contactDetailsProps {
  firstName: string;
  lastName: string;
  email: string;
  address: String;
  city: String;
  zipCode: String;
  country: String;
  companyName: String;
}

export interface giftDetailsProps {
  type: String | null;
  recipientName: String | null;
  email: String | null;
  giftMessage: String | null;
  recipientTreecounter: Number | null;
  receipients: {} | null;
}
