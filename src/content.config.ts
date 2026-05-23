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
      'agentic-ai',
      'data',
      'code',
      'cloud',
    ]),
    bluf: z.string(),
    order: z.number(),
    lang: langField,
    topics: z.array(z.string()).optional(),
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
