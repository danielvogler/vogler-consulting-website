// Single source of truth for the public contact address.
//
// The value is injected at build time via the CONTACT_EMAIL environment
// variable (see .env.example and .github/workflows/deploy.yml). The fallback
// below is what ships whenever that variable is unset — including production,
// where no CONTACT_EMAIL secret is currently configured — so it must always be
// the address we are happy to publish.
export const CONTACT_EMAIL: string = import.meta.env.CONTACT_EMAIL || 'info@vogler-consulting.ch';

export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;
