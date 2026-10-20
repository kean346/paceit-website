import type { Metadata } from 'next';
import { business } from '@/lib/business';

/** Public facts stated on the website or supplied by its owner. Never put credentials here. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://paceit.co.za';
const origin = new URL(configuredUrl);
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be the HTTPS origin of the public website.');
}

export const site = {
  name: 'paceIT',
  url: origin.origin,
  email: 'info@paceit.co.za',
  title: 'Custom Software & Automation in Pretoria | paceIT',
  description: 'Custom software, web applications and business automation from paceIT, an independent technology studio in Pretoria, South Africa.',
  socialImage: '/social/paceit.png',
};

export const isPreview = process.env.VERCEL_ENV === 'preview';
// Add approved, published pages here; fragments and API routes are not pages.
export const indexableRoutes = ['/', '/privacy', '/terms'] as const;
export const absoluteUrl = (path: string) => new URL(path, site.url).toString();

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const images = [{ url: site.socialImage, width: 1200, height: 630, alt: 'paceIT — Custom software and automation. Pretoria, South Africa.' }];
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: fullTitle, description, type: 'website', siteName: site.name, locale: 'en_ZA', url: absoluteUrl(path), images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images },
  };
}

export function businessSchema() {
  const businessId = absoluteUrl('/#organization');
  const services = [
    { id: 'custom-software', name: 'Custom software and web applications', description: 'Custom web apps, customer portals and internal tools that make the day-to-day easier.' },
    { id: 'business-automation', name: 'Business automation and integrations', description: 'Connect your tools, cut repeat admin and keep the next step moving.' },
    { id: 'dashboards-reporting', name: 'Dashboards and reporting', description: 'Bring information together in useful dashboards. Add AI where it genuinely helps.' },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': businessId, name: site.name,
        legalName: `${business.ownerName} trading as ${site.name}`,
        url: absoluteUrl('/'), logo: absoluteUrl('/icon.svg'), email: site.email,
        address: business.address,
        description: site.description,
        founder: { '@type': 'Person', name: 'Kean Maan' },
        areaServed: [
          { '@type': 'City', name: 'Pretoria' },
          { '@type': 'Country', name: 'South Africa' },
        ],
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer enquiries', email: site.email, url: absoluteUrl('/#contact') },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Software and automation services', itemListElement: services.map(service => ({ '@type': 'Offer', itemOffered: { '@id': absoluteUrl(`/#${service.id}`) } })) },
      },
      { '@type': 'WebSite', '@id': absoluteUrl('/#website'), url: absoluteUrl('/'), name: site.name, inLanguage: 'en-ZA', publisher: { '@id': businessId } },
      { '@type': 'WebPage', '@id': absoluteUrl('/#webpage'), url: absoluteUrl('/'), name: site.title, description: site.description, inLanguage: 'en-ZA', isPartOf: { '@id': absoluteUrl('/#website') }, about: { '@id': businessId } },
      ...services.map(service => ({ '@type': 'Service', '@id': absoluteUrl(`/#${service.id}`), url: absoluteUrl(`/#${service.id}`), name: service.name, description: service.description, provider: { '@id': businessId }, areaServed: { '@type': 'Country', name: 'South Africa' } })),
    ],
  };
}
