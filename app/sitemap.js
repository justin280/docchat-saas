export default function sitemap() {
  const baseUrl = 'https://docchat-saas.vercel.app';
  const lastModified = new Date('2026-05-05');
  
  const staticPages = [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: baseUrl + '/enterprise', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/healthcare', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/legal-ai', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/pricing', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/security', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: baseUrl + '/security/documents', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/compare', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/compliance', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/api-docs', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/contact', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/blog/ai-healthcare-research', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/blog/deepseek-ai', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/blog/excel-ai', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/blog/financial-report-analysis', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/blog/mistral-ai', lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
  
  return staticPages;
}
