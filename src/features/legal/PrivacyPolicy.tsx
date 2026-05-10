import { useTranslation } from 'react-i18next';
import { useConsentStore, APP_STORAGE_KEYS } from './consent.store';
import {
  page,
  header,
  title,
  subtitle,
  section,
  sectionTitle,
  paragraph,
  table,
  th,
  td,
  code,
  status,
  statusAccepted,
  statusRejected,
  statusUndecided,
  buttonRow,
  button,
  buttonDanger,
} from './PrivacyPolicy.css';

const STORAGE_KEY_DOCS: Array<{
  key: (typeof APP_STORAGE_KEYS)[number];
  purposeKey: string;
}> = [
  { key: 'shit-inventory', purposeKey: 'legal.policy.storage.purpose.inventory' },
  { key: 'shit-messages', purposeKey: 'legal.policy.storage.purpose.messages' },
  {
    key: 'shit-messages-settings',
    purposeKey: 'legal.policy.storage.purpose.messagesSettings',
  },
  {
    key: 'shit-messages-history',
    purposeKey: 'legal.policy.storage.purpose.messagesHistory',
  },
  { key: 'shit-theme', purposeKey: 'legal.policy.storage.purpose.theme' },
  { key: 'shit-language', purposeKey: 'legal.policy.storage.purpose.language' },
  { key: 'i18nextLng', purposeKey: 'legal.policy.storage.purpose.i18next' },
];

export function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const consentStatus = useConsentStore((s) => s.status);
  const decidedAt = useConsentStore((s) => s.decidedAt);
  const accept = useConsentStore((s) => s.accept);
  const reject = useConsentStore((s) => s.reject);
  const reset = useConsentStore((s) => s.reset);

  const decidedAtText = decidedAt
    ? new Date(decidedAt).toLocaleString(i18n.language)
    : null;

  const statusClass =
    consentStatus === 'accepted'
      ? statusAccepted
      : consentStatus === 'rejected'
        ? statusRejected
        : statusUndecided;

  return (
    <div className={page}>
      <div className={header}>
        <h1 className={title}>{t('legal.policy.title')}</h1>
        <p className={subtitle}>
          {t('legal.policy.lastUpdated', { date: '2026-05-10' })}
        </p>
      </div>

      <div className={section}>
        <p className={paragraph}>{t('legal.policy.intro')}</p>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.collect.title')}</h2>
        <p className={paragraph}>{t('legal.policy.collect.body')}</p>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.storage.title')}</h2>
        <p className={paragraph}>{t('legal.policy.storage.body')}</p>
        <table className={table} data-testid="privacy-storage-table">
          <thead>
            <tr>
              <th className={th}>{t('legal.policy.storage.col.key')}</th>
              <th className={th}>{t('legal.policy.storage.col.purpose')}</th>
            </tr>
          </thead>
          <tbody>
            {STORAGE_KEY_DOCS.map(({ key, purposeKey }) => (
              <tr key={key}>
                <td className={td}>
                  <code className={code}>{key}</code>
                </td>
                <td className={td}>{t(purposeKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.retention.title')}</h2>
        <p className={paragraph}>{t('legal.policy.retention.body')}</p>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.rights.title')}</h2>
        <p className={paragraph}>{t('legal.policy.rights.body')}</p>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.consent.title')}</h2>
        <span
          className={`${status} ${statusClass}`}
          data-testid="consent-status"
          data-status={consentStatus}
        >
          {t(`legal.policy.consent.status.${consentStatus}`)}
          {decidedAtText && ` · ${decidedAtText}`}
        </span>
        <div className={buttonRow}>
          {consentStatus !== 'accepted' && (
            <button
              type="button"
              className={button}
              onClick={accept}
              data-testid="privacy-accept"
            >
              {t('legal.banner.accept')}
            </button>
          )}
          {consentStatus !== 'rejected' && (
            <button
              type="button"
              className={`${button} ${buttonDanger}`}
              onClick={reject}
              data-testid="privacy-reject"
            >
              {t('legal.policy.consent.rejectAndClear')}
            </button>
          )}
          <button
            type="button"
            className={button}
            onClick={reset}
            data-testid="privacy-reset"
          >
            {t('legal.policy.consent.reset')}
          </button>
        </div>
      </div>

      <div className={section}>
        <h2 className={sectionTitle}>{t('legal.policy.contact.title')}</h2>
        <p className={paragraph}>{t('legal.policy.contact.body')}</p>
      </div>
    </div>
  );
}
