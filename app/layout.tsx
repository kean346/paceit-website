import type { Metadata } from 'next';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import './globals.css';
export const metadata: Metadata = {
 title: 'paceIT — Software that moves your business forward',
 description: 'Custom software, web applications and practical automation. Independent technology studio based in South Africa.',
 openGraph: { title: 'paceIT — Better systems. More possibility.', description: 'Custom software and automation, built around your business.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en-ZA"><body>{children}</body></html>;
}
