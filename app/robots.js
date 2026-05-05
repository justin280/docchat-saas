export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://docchat-saas.vercel.app/sitemap.xml',
  };
}
