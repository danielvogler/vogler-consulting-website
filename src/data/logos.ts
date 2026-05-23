export interface LogoEntry {
  name: string;
  slug: string;
  category: 'cloud' | 'data' | 'ai';
}

export const LOGOS: LogoEntry[] = [
  { name: 'Google Cloud', slug: 'googlecloud', category: 'cloud' },
  { name: 'BigQuery', slug: 'googlebigquery', category: 'cloud' },
  { name: 'Terraform', slug: 'terraform', category: 'cloud' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'cloud' },
  { name: 'Helm', slug: 'helm', category: 'cloud' },
  { name: 'Docker', slug: 'docker', category: 'cloud' },
  { name: 'OpenTelemetry', slug: 'opentelemetry', category: 'cloud' },

  { name: 'Python', slug: 'python', category: 'data' },
  { name: 'pandas', slug: 'pandas', category: 'data' },
  { name: 'NumPy', slug: 'numpy', category: 'data' },
  { name: 'Plotly', slug: 'plotly', category: 'data' },
  { name: 'Streamlit', slug: 'streamlit', category: 'data' },
  { name: 'Ray', slug: 'ray', category: 'data' },
  { name: 'DVC', slug: 'dvc', category: 'data' },
  { name: 'GitHub Actions', slug: 'githubactions', category: 'data' },
  { name: 'GitLab', slug: 'gitlab', category: 'data' },
  { name: 'C#', slug: 'csharp', category: 'data' },

  { name: 'Anthropic', slug: 'anthropic', category: 'ai' },
  { name: 'Claude', slug: 'claude', category: 'ai' },
  { name: 'Google Gemini', slug: 'googlegemini', category: 'ai' },
  { name: 'LangChain', slug: 'langchain', category: 'ai' },
  { name: 'LangGraph', slug: 'langgraph', category: 'ai' },
];

export const LOGO_SLUGS = LOGOS.map((l) => l.slug);
