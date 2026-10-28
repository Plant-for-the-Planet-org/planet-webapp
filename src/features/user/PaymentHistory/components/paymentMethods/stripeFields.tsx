import type { ReactNode } from 'react';

/** What a setup form's `confirm` resolves to. */
export type SetupResult =
  | { paymentMethodId: string }
  | { error: string }
  | { validationFailed: true };

export interface SetupFormHandle {
  confirm: (clientSecret: string) => Promise<SetupResult>;
}

export interface SetupFormProps {
  /** Prefills the cardholder or account holder name. */
  defaultName: string;
  email: string;
  /** Stripe fields live in iframes, so Esc pressed inside one never reaches the dialog. */
  onEscape: () => void;
}

// Stripe fields render in iframes and cannot read the app's CSS variables, so the colours are spelled out: --foreground, --muted-foreground and --destructive.
export const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: '14px',
    color: '#333333',
    '::placeholder': { color: '#828282' },
  },
  invalid: { color: '#EB5757' },
};

interface FieldProps {
  label: string;
  /** Matches the `id` on a plain input, so its label is clickable. */
  htmlFor?: string;
  error?: string | null;
  children: ReactNode;
}

export const Field = ({ label, htmlFor, error, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {label}
    </label>
    {children}
    {error && (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);

/** Gives a Stripe iframe the same frame as the app's Input. */
export const StripeFieldFrame = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md border border-solid border-input bg-background px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
    {children}
  </div>
);
