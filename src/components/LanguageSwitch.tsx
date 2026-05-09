import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@/lib/i18n';
import { vars } from '@/styles/theme.css';

const languages: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'En' },
  { code: 'zh', label: '中' },
  { code: 'ja', label: '日' },
];

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
      }}
    >
      {languages.map(({ code, label }) => {
        const active = current === code;
        return (
          <button
            key={code}
            type="button"
            aria-label={i18n.t(`lang.${code}`)}
            aria-pressed={active}
            onClick={() => i18n.changeLanguage(code)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: 'none',
              background: active ? vars.color.surface : 'transparent',
              color: active ? vars.color.text : vars.color.textMuted,
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
