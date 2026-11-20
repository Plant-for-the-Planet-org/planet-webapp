import type { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

// @planet-sdk/common defines this type but does not export it from the package root.
export type Nullable<T> = T | null;

/**
 * Date string with the following formats
 *  `YYYY-MM-DD hh:mm:ss` or `YYYY-MM-DDTHH:mm:ss.sssZ` or `YYYY-MM-DD hh:mm:ss.sssZ`
 * i.e. ISO 8601 extended format */
export type DateString = string;

export interface IconProps {
  color?: string;
  width?: string | number | undefined;
  height?: string | number | undefined;
  className?: string | undefined;
  solid?: boolean;
}
