import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kissanmandi-tawny.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/farmer/', '/buyer/', '/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
