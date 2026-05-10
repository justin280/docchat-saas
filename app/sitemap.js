export default function sitemap() {
  const baseUrl = 'https://docchat-saas.vercel.app';
  const lastModified = new Date('2026-05-05');
  
  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: baseUrl + '/compliance', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl + '/contact', lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
