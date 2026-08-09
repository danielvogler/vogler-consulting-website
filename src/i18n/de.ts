export interface Strings {
  nav: {
    services: string;
    about: string;
    team: string;
    careers: string;
    projects: string;
    contact: string;
  };
  footer: {
    contact: string;
    legal: string;
    rights: string;
    imprint: string;
    privacy: string;
  };
  hero: {
    slogan: string;
    entries: {
      services: string;
      about: string;
      team: string;
      careers: string;
      projects: string;
    };
  };
  pages: {
    home: { title: string };
    services: { title: string; heading: string; lead: string };
    about: { title: string; heading: string; lead: string };
    team: { title: string; heading: string; lead: string; partnersHeading: string };
    careers: { title: string; heading: string; lead: string };
    projects: { title: string; heading: string; lead: string };
    impressum: { title: string; heading: string };
    datenschutz: { title: string; heading: string };
  };
  languageSwitcher: {
    de: string;
    en: string;
    label: string;
  };
  a11y: {
    skipToContent: string;
  };
}

export const de: Strings = {
  nav: {
    services: 'Leistungen',
    about: 'Über uns',
    team: 'Team',
    careers: 'Karriere',
    projects: 'Projekte',
    contact: 'Kontakt',
  },
  footer: {
    contact: 'Kontakt',
    legal: 'Rechtliches',
    rights: 'Alle Rechte vorbehalten.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  hero: {
    slogan: 'KI, Autonome Agenten & Data Analytics. Cloud oder On-Premises.',
    entries: {
      services: 'Leistungen',
      about: 'Über uns',
      team: 'Team',
      careers: 'Karriere',
      projects: 'Projekte',
    },
  },
  pages: {
    home: { title: 'VOGLER CONSULTING' },
    services: {
      title: 'Leistungen, VOGLER CONSULTING',
      heading: 'Leistungen',
      lead: 'Agentische KI-Lösungen, End-to-End-Delivery und Workshops.',
    },
    about: {
      title: 'Über uns, VOGLER CONSULTING',
      heading: 'Über uns',
      lead: 'Schweizer Beratung für KI · agentische KI · Analytics · Daten.',
    },
    team: {
      title: 'Team, VOGLER CONSULTING',
      heading: 'Team',
      lead: 'Unser Netzwerk und unsere Partner.',
      partnersHeading: 'Partner',
    },
    careers: {
      title: 'Karriere, VOGLER CONSULTING',
      heading: 'Karriere',
      lead: 'Die Fachprofile, auf denen unsere Leistungen aufbauen. Initiativbewerbungen sind willkommen.',
    },
    projects: {
      title: 'Projekte, VOGLER CONSULTING',
      heading: 'Projekte',
      lead: 'Referenzen aus unserer Arbeit.',
    },
    impressum: {
      title: 'Impressum, VOGLER CONSULTING',
      heading: 'Impressum',
    },
    datenschutz: {
      title: 'Datenschutz, VOGLER CONSULTING',
      heading: 'Datenschutzerklärung',
    },
  },
  languageSwitcher: {
    de: 'DE',
    en: 'EN',
    label: 'Sprache wechseln',
  },
  a11y: {
    skipToContent: 'Direkt zum Inhalt',
  },
};
