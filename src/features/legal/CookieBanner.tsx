import { useTranslation } from 'react-i18next';
import { useConsentStore } from './consent.store';
import {
  banner,
  text,
  link,
  actions,
  button,
  buttonPrimary,
} from './CookieBanner.css';

interface CookieBannerProps {
  onShowPrivacyPolicy: () => void;
}

export function CookieBanner({ onShowPrivacyPolicy }: CookieBannerProps) {
  const { t } = useTranslation();
  const status = useConsentStore((s) => s.status);
  const accept = useConsentStore((s) => s.accept);
  const reject = useConsentStore((s) => s.reject);

  if (status !== 'undecided') return null;

  return (
    <div
      className={banner}
      role="dialog"
      aria-modal="false"
      aria-label={t('legal.banner.title')}
      data-testid="cookie-banner"
    >
      <p className={text}>
        {t('legal.banner.body')}{' '}
        <button
          type="button"
          className={link}
          onClick={onShowPrivacyPolicy}
          data-testid="cookie-banner-privacy-link"
        >
          {t('legal.banner.learnMore')}
        </button>
      </p>
      <div className={actions}>
        <button
          type="button"
          className={button}
          onClick={reject}
          data-testid="cookie-banner-reject"
        >
          {t('legal.banner.reject')}
        </button>
        <button
          type="button"
          className={`${button} ${buttonPrimary}`}
          onClick={accept}
          data-testid="cookie-banner-accept"
        >
          {t('legal.banner.accept')}
        </button>
      </div>
    </div>
  );
}
