import type { ReactNode } from 'react';
import type { PaymentLineItem } from '../types';

import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, UserRound } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import getFormattedCurrency from '@/utils/countryCurrency/getFormattedCurrency';

import { formatPaymentDate } from '../lib/formatPaymentDate';
import { getLineLabel, getPaymentTitle } from '../lib/getPaymentTitle';
import { getFundraiserUrl } from '@/utils/constants/fundraiser';

import { usePaymentDetail } from '../hooks/usePaymentDetail';
import { usePaymentTitleLabels } from '../hooks/usePaymentTitleLabels';
import { DownloadCodesButton } from './DownloadCodesButton';
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

/**
 * The payment detail body (title + amount, meta, fundraiser, line items,
 * gift, downloads). Rendered inside the Sheet on small screens and
 * the inline pane on large screens. Fetches its own data from the guid.
 */
export const PaymentDetailContent = ({ guid }: { guid: string | null }) => {
  const t = useTranslations('Me');
  const tPayments = useTranslations('Payments');
  const locale = useLocale();
  const { detail, isLoading } = usePaymentDetail(guid);
  const titleLabels = usePaymentTitleLabels();

  const money = (amount: number) =>
    getFormattedCurrency(locale, detail?.currency ?? '', amount);

  // Map backend codes to Me-namespace labels with LITERAL keys: next-intl's
  // typed messages reject a dynamic t(code), and a missing message returns the
  // key path (e.g. "Me.complete") instead of throwing — so an unmapped code
  // must fall back to the raw string here, never to t().
  const statusLabel = (status: string | null) => {
    if (!status) return undefined;
    const labels: Record<string, string> = {
      paid: t('paid'),
      complete: t('completed'),
      pending: t('pending'),
      failed: t('failed'),
      refunded: t('refunded'),
    };
    return labels[status] ?? status;
  };

  // Payment method codes ("offline" / "planet-cash" / "stripe-card" …) mapped
  // to human names ("Bank Transfer", "PlanetCash", …); unmapped codes show raw.
  const methodLabel = (method: string) => {
    const labels: Record<string, string> = {
      offline: t('offline'),
      card: t('card'),
      sepa_debit: t('sepa_debit'),
      'planet-cash': t('planet-cash'),
      'stripe-card': t('stripe-card'),
      'stripe-sepa_debit': t('stripe-sepa_debit'),
    };
    return labels[method] ?? method;
  };

  // The project or account first, then what it was ("50 Trees",
  // "Membership"), unless the caption already says it ("PlanetCash - Jane").
  const lineText = (li: PaymentLineItem) => {
    const label = getLineLabel(li, titleLabels);
    const caption = li.caption?.trim();
    const showLabel =
      caption && !caption.toLowerCase().includes(label.toLowerCase());
    return (
      <div className="min-w-0">
        <p className="text-sm text-foreground">{caption || label}</p>
        {showLabel && (
          <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        )}
      </div>
    );
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
  const gift = detail.gift;
  const hasGift = Boolean(
    gift?.recipient || gift?.message || gift?.occasion || gift?.comment
  );
  // As on the old payment history: a bouquet or composite donation offers no
  // gift certificate or codes.
  const canHaveGiftDownloads =
    detail.purpose !== 'bouquet' && detail.purpose !== 'composite';
  const giftCertificate = canHaveGiftDownloads ? gift?.certificate : undefined;
  const codesUrl = canHaveGiftDownloads ? gift?.codesUrl : undefined;
  const linkClass =
    'inline-flex items-center gap-2 text-sm text-primary hover:underline';

  const fundraiser = detail.fundraiser;
  const fundraiserRef = fundraiser?.slug ?? fundraiser?.guid;
  const fundraiserUrl = fundraiserRef ? getFundraiserUrl(fundraiserRef) : null;

  return (
    <div className="flex flex-col">
      <p className="text-sm text-muted-foreground">
        {getPaymentTitle(detail, titleLabels)}
      </p>

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
          value={formatPaymentDate(detail.paymentDate, locale)}
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

      {lineItems.length === 1 && (
        <Section title={tPayments('supports')}>
          {lineText(lineItems[0])}
        </Section>
      )}

      {lineItems.length > 1 && (
        <Section title={tPayments('supports')}>
          <div className="overflow-hidden rounded-lg border border-border">
            {lineItems.map((li, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 border-b border-border p-3 last:border-b-0"
              >
                {lineText(li)}
                {li.amount != null && (
                  <span className="shrink-0 text-sm tabular-nums text-foreground">
                    {money(li.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasGift && gift && (
        <Section title={gift.recipient ? tPayments('dedicatedTo') : t('gift')}>
          {gift.recipient && (
            <div className="flex items-center gap-2">
              <UserRound className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="text-sm text-foreground">{gift.recipient}</span>
            </div>
          )}
          {gift.message && (
            <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-foreground">
              {gift.message}
            </p>
          )}
          <DetailRow label={t('giftOccasion')} value={gift.occasion} />
          <DetailRow label={t('giftComment')} value={gift.comment} />
        </Section>
      )}

      {(detail.certificate || giftCertificate || codesUrl) && (
        <Section title={t('downloads')}>
          <div className="flex flex-col items-start gap-2">
            {detail.certificate && (
              <a
                href={detail.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <ExternalLink className="size-4" aria-hidden />
                {t('donorCertificate')}
              </a>
            )}
            {giftCertificate && (
              <a
                href={giftCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <ExternalLink className="size-4" aria-hidden />
                {t('giftCertificate')}
              </a>
            )}
            {codesUrl && <DownloadCodesButton codesUrl={codesUrl} />}
          </div>
        </Section>
      )}
    </div>
  );
};
