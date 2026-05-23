import { de } from './de';
import { en } from './en';

export type Locale = 'de' | 'en';

const strings = { de, en } as const;

export function t(locale: Locale) {
  return strings[locale];
}

export function getNavLinks(locale: Locale) {
  const s = strings[locale];
  const prefix = locale === 'de' ? '' : '/en';
  return [
    { href: `${prefix}/services`, label: s.nav.services },
    { href: `${prefix}/about`, label: s.nav.about },
    { href: `${prefix}/team`, label: s.nav.team },
    // Projects is intentionally disabled in the public nav.
    // To re-enable: move src/_drafts/{,en/}projects.astro back into src/pages/
    // and uncomment the line below + the entry tile in src/pages/{,en/}index.astro.
    // { href: `${prefix}/projects`, label: s.nav.projects },
  ];
}

export function getLegalLinks(locale: Locale) {
  const s = strings[locale];
  if (locale === 'de') {
    return [
      { href: '/impressum', label: s.footer.imprint },
      { href: '/datenschutz', label: s.footer.privacy },
    ];
  }
  return [
    { href: '/en/imprint', label: s.footer.imprint },
    { href: '/en/privacy', label: s.footer.privacy },
  ];
}

export function getHomeHref(locale: Locale): string {
  return locale === 'de' ? '/' : '/en';
}

export function otherLocalePath(pathname: string, currentLocale: Locale): string {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (currentLocale === 'de') {
    if (normalized === '/') return '/en';
    return `/en${normalized}`;
  }
  if (normalized === '/en') return '/';
  return normalized.replace(/^\/en/, '') || '/';
}
