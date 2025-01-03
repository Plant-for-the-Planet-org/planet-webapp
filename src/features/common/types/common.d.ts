import type { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

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
