import type { CalendarProps } from '@/components/ui/calendar';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cs, de, enUS, es, fr, it, ptBR } from 'react-day-picker/locale';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

// One calendar locale per app language; month names, weekday names and the
// first day of the week come from it.
const CALENDAR_LOCALES: Record<string, NonNullable<CalendarProps['locale']>> = {
  cs,
  de,
  en: enUS,
  es,
  fr,
  it,
  'pt-BR': ptBR,
};

/** `YYYY-MM-DD` to a local date, so the day does not shift with the timezone. */
const toDate = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const toValue = (date: Date): string =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

/**
 * A date field that opens a calendar in the app language, unlike a native date
 * input, whose picker follows the browser language. The value stays
 * `YYYY-MM-DD`, exactly what the subscription payloads expect; `min` and `max`
 * limit which days can be picked.
 */
export const DateField = ({
  id,
  value,
  onChange,
  min,
  max,
}: DateFieldProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const selected = toDate(value);
  const minDate = toDate(min);
  const maxDate = toDate(max);
  const label = selected
    ? new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(selected)
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-10 w-full items-center gap-2 rounded-md border border-solid border-input bg-background px-3 py-2 text-left text-sm text-foreground ring-offset-background [font-family:inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <CalendarIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={CALENDAR_LOCALES[locale] ?? enUS}
          selected={selected}
          defaultMonth={selected ?? minDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          onSelect={(date) => {
            if (!date) return;
            onChange(toValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
