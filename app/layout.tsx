// ===========================================
// Root Layout
// ===========================================

import type { Metadata, Viewport } from 'next';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Tower Jump - Farcaster Mini App',
  description: 'Climb the endless tower! A Farcaster Mini App game on Base.',
  openGraph: {
    title: 'Tower Jump',
    description: 'Climb the endless tower! A Farcaster Mini App game on Base.',
    type: 'website',
    url: appUrl,
    images: [`${appUrl}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tower Jump',
    description: 'Climb the endless tower! A Farcaster Mini App game on Base.',
  },
  other: {
    // Farcaster Mini App meta tag
    'fc:miniapp': JSON.stringify({
      version: 'next',
      name: 'Tower Jump',
      iconUrl: `${appUrl}/icon`,
      homeUrl: appUrl,
      splashImageUrl: `${appUrl}/splash`,
      splashBackgroundColor: '#1a1a2e',
      action: {
        type: 'launch_frame',
      },
    }),
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
