import type { ReactNode } from 'react';
import type { PaymentLineItem } from '../types';

import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, UserRound } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';
import formatDate from '@/utils/countryCurrency/getFormattedDate';
import { getFundraiserUrl } from '@/utils/constants/fundraiser';

import { usePaymentDetail } from '../hooks/usePaymentDetail';
import { PaymentStatusBadge } from './PaymentStatusBadge';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="pt-4">
    <p className="mb-2 text-sm font-medium text-foreground">{title}</p>
    {children}
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
};

const sum = (
  items: PaymentLineItem[],
  pick: (li: PaymentLineItem) => number | null | undefined
) => items.reduce((total, li) => total + (pick(li) ?? 0), 0);

/**
 * The payment detail body (title + amount, meta, fundraiser, causes supported,
 * fees, dedication, downloads). Rendered inside the Sheet on small screens and
 * the inline pane on large screens. Fetches its own data from the guid.
 */
export const PaymentDetailContent = ({ guid }: { guid: string | null }) => {
  const t = useTranslations('Me');
  const tPayments = useTranslations('Payments');
  const locale = useLocale();
  const { detail, isLoading } = usePaymentDetail(guid);

  const money = (amount: number) =>
    getFormattedCurrency(locale, detail?.currency ?? '', amount);

  const statusLabel = (status: string | null) => {
    if (!status) return undefined;
    try {
      return t(status);
    } catch {
      return status;
    }
  };

  // Payment methods carry codes like "offline" / "planet-cash" / "stripe-card";
  // the Me namespace maps them to human names ("Bank Transfer", "PlanetCash", …).
  const methodLabel = (method: string) => {
    try {
      return t(method);
    } catch {
      return method;
    }
  };

  const unitLabel = (li: PaymentLineItem) => {
    if (li.units == null) return '';
    if (li.unitType === 'm2') return `${li.units} m²`;
    if (li.unitType === 'tree') return `${li.units} ${t('trees')}`;
    return '';
  };

  if (!guid) return null;

  if (isLoading || !detail) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const lineItems = detail.lineItems ?? [];
  const projectLines = lineItems.filter((li) => !li.isSupport);
  const supportTotal = sum(
    lineItems.filter((li) => li.isSupport),
    (li) => li.amount
  );
  const feeCoveredTotal = sum(lineItems, (li) => li.absorbedFee);
  const taxTotal = sum(lineItems, (li) => li.tax);
  const dedicatedTo = detail.gift?.recipient;

  const fundraiser = detail.fundraiser;
  const fundraiserRef = fundraiser?.slug ?? fundraiser?.guid;
  const fundraiserUrl = fundraiserRef ? getFundraiserUrl(fundraiserRef) : null;

  return (
    <div className="flex flex-col">
      <p className="text-sm text-muted-foreground">{t('donation')}</p>

      <div className="flex items-center justify-between gap-4 py-3">
        <span className="text-2xl font-medium tabular-nums text-foreground">
          {money(detail.amount)}
        </span>
        <PaymentStatusBadge
          status={detail.status}
          label={statusLabel(detail.status)}
        />
      </div>

      <Separator />
      <div className="pt-2">
        <DetailRow
          label={t('paymentDate')}
          value={detail.paymentDate ? formatDate(detail.paymentDate) : ''}
        />
        <DetailRow label={tPayments('donationId')} value={detail.reference} />
        {detail.method && (
          <DetailRow label={t('method')} value={methodLabel(detail.method)} />
        )}
      </div>

      {fundraiser?.name && (
        <Section title={tPayments('fundraiser')}>
          {fundraiserUrl ? (
            <a
              href={fundraiserUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              {fundraiser.name}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : (
            <p className="text-sm text-foreground">{fundraiser.name}</p>
          )}
        </Section>
      )}

      {projectLines.length === 1 && (
        <Section title={tPayments('supports')}>
          <p className="text-sm text-foreground">
            {projectLines[0].caption ?? t('project')}
          </p>
          {unitLabel(projectLines[0]) && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {unitLabel(projectLines[0])}
            </p>
          )}
        </Section>
      )}

      {projectLines.length > 1 && (
        <Section title={tPayments('supportedProjects')}>
          <div className="overflow-hidden rounded-lg border border-border">
            {projectLines.map((li, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 border-b border-border p-3 text-sm last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-foreground">
                    {li.caption ?? t('project')}
                  </div>
                  {unitLabel(li) && (
                    <div className="text-xs text-muted-foreground">
                      {unitLabel(li)}
                    </div>
                  )}
                </div>
                {li.amount != null && (
                  <span className="shrink-0 tabular-nums text-foreground">
                    {money(li.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {(supportTotal > 0 || feeCoveredTotal > 0 || taxTotal > 0) && (
        <div className="pt-2">
          {supportTotal > 0 && (
            <DetailRow
              label={tPayments('support')}
              value={money(supportTotal)}
            />
          )}
          {feeCoveredTotal > 0 && (
            <DetailRow
              label={tPayments('feeCovered')}
              value={money(feeCoveredTotal)}
            />
          )}
          {taxTotal > 0 && (
            <DetailRow label={tPayments('tax')} value={money(taxTotal)} />
          )}
        </div>
      )}

      {dedicatedTo && (
        <Section title={tPayments('dedicatedTo')}>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-sm text-foreground">{dedicatedTo}</span>
          </div>
          {detail.gift?.message && (
            <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-foreground">
              {detail.gift.message}
            </p>
          )}
        </Section>
      )}

      {detail.certificate && (
        <Section title={t('downloads')}>
          <a
            href={detail.certificate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            {t('donorCertificate')}
          </a>
        </Section>
      )}
    </div>
  );
};
