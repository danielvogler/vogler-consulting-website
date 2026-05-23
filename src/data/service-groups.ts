export type ServiceGroupKey = 'discovery' | 'dataAnalytics' | 'agentic' | 'workshops';

export interface ServiceGroup {
  key: ServiceGroupKey;
  labels: { de: string; en: string };
  tracks: string[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  {
    key: 'discovery',
    labels: { de: 'Discovery', en: 'Discovery' },
    tracks: ['discovery'],
  },
  {
    key: 'agentic',
    labels: { de: 'KI-Agenten', en: 'AI Agents' },
    tracks: ['agentic-framework', 'agentic-install', 'agentic-deep'],
  },
  {
    key: 'dataAnalytics',
    labels: { de: 'Daten & Analytics', en: 'Data & Analytics' },
    tracks: ['delivery', 'rag'],
  },
  {
    key: 'workshops',
    labels: { de: 'Workshops', en: 'Workshops' },
    tracks: ['agentic-ai', 'data', 'code', 'cloud'],
  },
];

export function groupForTrack(track: string): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((g) => g.tracks.includes(track));
}

export function labelForTrack(track: string, lang: 'de' | 'en'): string {
  return groupForTrack(track)?.labels[lang] ?? '';
}
