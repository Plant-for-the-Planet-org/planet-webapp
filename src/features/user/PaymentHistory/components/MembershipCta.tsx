import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

const DONOR_CIRCLE_URL_DE =
  'https://www.plant-for-the-planet.org/de/foerdermitgliedschaft/';
const DONOR_CIRCLE_URL = 'https://www.plant-for-the-planet.org/donor-circle/';

/**
 * Slim, text-based Donor Circle membership prompt (no image, no large block) —
 * a subtle primary-tinted banner shown to non-members in the empty detail pane.
 */
export const MembershipCta = () => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const href = locale === 'de' ? DONOR_CIRCLE_URL_DE : DONOR_CIRCLE_URL;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground transition-colors hover:bg-primary/10"
    >
      <span>
        {t.rich('membershipCtaCopy', {
          highlight: (chunks) => (
            <span className="font-semibold">{chunks}</span>
          ),
        })}
      </span>
      <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-semibold text-primary">
        {t('membershipCtaButtonText')}
        <ArrowRight className="size-4" aria-hidden />
      </span>
    </a>
  );
};
