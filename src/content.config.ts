import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const langField = z.enum(['de', 'en']);

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    track: z.enum([
      'agentic-install',
      'agentic-deep',
      'agentic-framework',
      'rag',
      'delivery',
      'discovery',
      'ai-roadmap',
      'agentic-ai-leadership',
      'ai-governance',
      'agentic-ai',
      'data',
      'code',
      'cloud',
      'coding-agents',
      'llm-prompting',
    ]),
    bluf: z.string(),
    order: z.number(),
    lang: langField,
    topics: z.array(z.string()).optional(),
    // Workshop-specific optional detail fields (used on /workshops/[slug] pages).
    audience: z.array(z.string()).optional(),
    format: z.array(z.string()).optional(),
    duration: z.string().optional(),
    languages: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    booking: z.string().optional(),
    // Rendered as a footnote under the workshop detail. Used where the subject
    // matter needs a standing caveat, e.g. governance content is orientation
    // for decisions and not legal advice.
    disclaimer: z.string().optional(),
    agenda: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          duration: z.string().optional(),
        }),
      )
      .optional(),
    // Consulting-engagement detail fields (used on /services/[slug] pages).
    // A service renders a detail page as soon as it defines `approach`.
    situation: z.string().optional(),
    approach: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          deliverable: z.string().optional(),
        }),
      )
      .optional(),
    workstreams: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    outcomes: z.array(z.string()).optional(),
    involvement: z.array(z.string()).optional(),
    entryPoint: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
      order: z.number(),
      lang: langField,
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    logo: z.string().optional(),
    kind: z.enum(['partner', 'project']),
    order: z.number(),
    lang: langField,
  }),
});

export const collections = { services, team, partners };
