import type { ReactNode } from 'react';

interface PaymentsPageShellProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

/**
 * shadcn/Tailwind replacement for the MUI `DashboardView` on this page — the
 * first account page whose own layout carries no MUI. Reproduces the parts
 * DashboardView provided that UserLayout does NOT: the fixed-navbar top offset
 * (~80px), content padding, the 1060px max content width, and the title/subtitle
 * header. Background + left/sidebar offset still come from UserLayout.
 */
export const PaymentsPageShell = ({
  title,
  subtitle,
  children,
}: PaymentsPageShellProps) => (
  <div className="mt-20 min-h-screen">
    <div className="flex max-w-[1060px] flex-col gap-6 px-5 pb-5 pt-[60px] sm:px-10 sm:pb-10 sm:pt-5">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-base text-muted-foreground">{subtitle}</p>
        )}
      </header>
      <main>{children}</main>
    </div>
  </div>
);
