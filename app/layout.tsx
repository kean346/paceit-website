import type { Metadata } from 'next';
import { absoluteUrl, isPreview, site } from '@/lib/site';
import localFont from 'next/font/local';
import './globals.css';

const jakarta = localFont({
 src: [
  { path: '../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
  { path: '../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
  { path: '../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  { path: '../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
 ],
 variable: '--font-jakarta', display: 'swap', preload: true,
});
const space = localFont({
 src: [
  { path: '../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2', weight: '400', style: 'normal' },
  { path: '../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2', weight: '500', style: 'normal' },
 ],
 variable: '--font-space', display: 'swap', preload: false,
});
export const metadata: Metadata = {
 metadataBase: new URL(site.url),
 title: { default: site.title, template: '%s | paceIT' },
 description: site.description,
 applicationName: site.name,
 robots: isPreview ? { index: false, follow: false } : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
 openGraph: { title: site.title, description: site.description, type: 'website', siteName: site.name, locale: 'en_ZA', url: absoluteUrl('/'), images: [{ url: site.socialImage, width: 1200, height: 630, alt: 'paceIT — Custom software and automation. Pretoria, South Africa.' }] },
 twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [{ url: site.socialImage, alt: 'paceIT — Custom software and automation. Pretoria, South Africa.' }] },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en-ZA"><body className={`${jakarta.variable} ${space.variable}`}>{children}</body></html>;
}
