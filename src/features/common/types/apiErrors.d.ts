export interface ApiCustomError {
  [key: string]: undefined;
  //Added to allow us to discriminate between this type and other types contained in a Union
  error_type: string;
  error_code: string;
  parameters?: {
    [key: string]: string | number | boolean;
  };
}
