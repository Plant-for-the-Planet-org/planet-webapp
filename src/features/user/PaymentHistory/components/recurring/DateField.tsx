import { useRef } from 'react';
import { Calendar } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DateFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

/**
 * A native date input with the calendar icon in FRONT of the text. The browser's
 * default indicator sits on the right; here it's stretched invisibly across the
 * field (so a click anywhere opens the picker) and a leading lucide Calendar is
 * shown instead. `showPicker()` is also called on click for browsers without the
 * webkit indicator. Native input keeps the value as YYYY-MM-DD — exactly what the
 * subscription payloads expect.
 */
export const DateField = ({
  id,
  value,
  onChange,
  min,
  max,
}: DateFieldProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Calendar
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={ref}
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        onClick={() => ref.current?.showPicker?.()}
        className={cn(
          'flex h-10 w-full rounded-md border border-solid border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
        )}
      />
    </div>
  );
};
