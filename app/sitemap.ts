import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kissanmandi-tawny.vercel.app';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/marketplace',
    '/marketplace/grains',
    '/marketplace/fruits',
    '/marketplace/vegetables',
    '/how-it-works',
    '/about',
    '/mission',
    '/contact',
    '/farmers',
    '/buyers',
    '/login',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route.includes('/marketplace') ? 'hourly' : 'weekly',
    priority: route === '' ? 1.0 : route.includes('/marketplace') ? 0.9 : 0.7,
  }));
}
