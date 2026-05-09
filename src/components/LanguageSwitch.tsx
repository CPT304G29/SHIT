import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { SupportedLanguage } from '@/lib/i18n';
import { trigger, content, item, itemActive, itemLabel } from './LanguageSwitch.css';

const languages: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'En' },
  { code: 'zh', label: '中文', native: '中' },
  { code: 'ja', label: '日本語', native: '日' },
];

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;
  const currentLang = languages.find((l) => l.code === current);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="Select language" className={trigger}>
          {currentLang?.native ?? current.toUpperCase()}
          <ChevronDown size={12} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} className={content}>
          {languages.map(({ code, label, native }) => {
            const active = current === code;
            return (
              <DropdownMenu.Item
                key={code}
                onSelect={() => i18n.changeLanguage(code)}
                className={`${item} ${active ? itemActive : ''}`}
              >
                <span>
                  {native}
                  <span className={itemLabel}>{label}</span>
                </span>
                {active && <Check size={14} />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
