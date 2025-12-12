import type { Metadata } from 'next';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Boversal';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://boversal.id.vn';
const APP_DESCRIPTION = 'Boversal - Modern Project Management Platform. Manage projects, tasks, meetings, and reminders efficiently. Built for teams and individuals.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Project Management Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'project management',
    'task management',
    'team collaboration',
    'project tracking',
    'agile',
    'scrum',
    'kanban',
    'task tracker',
    'productivity',
    'team workspace',
    'meeting scheduler',
    'calendar',
    'reminder',
    'boversal',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: `${APP_NAME} - Project Management Platform`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Project Management`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Project Management Platform`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: '@boversal',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
};
