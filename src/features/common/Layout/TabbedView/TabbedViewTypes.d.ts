export interface TabItem {
  label: string;
  /** relative link without localization. e.g. /about, not /en/about */
  link: string;
  disabled?: boolean;
  step: number | string;
}
