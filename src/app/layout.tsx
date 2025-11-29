'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/sw-register';
import { checkApiHiding } from '@/lib/api-debug';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Register service worker to hide API calls from Network tab
    registerServiceWorker();
    
    // Enable debug logging in development
    if (process.env.NODE_ENV === 'development') {
      checkApiHiding();
    }
  }, []);

  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Boversal';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://boversal.id.vn';
  // Add a small cache-busting version to force browsers to fetch updated icons
  const ASSET_VERSION = 'v7';
  const OG_IMAGE = `${APP_URL}/og-image.svg?${ASSET_VERSION}`;
  const LOGO_SVG = `${APP_URL}/logo.svg?${ASSET_VERSION}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        {/* ===================== THEME SCRIPT ===================== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* ===================== OPEN GRAPH (ZALO/FACEBOOK) ===================== */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${APP_NAME} — Quản lý công việc & cộng tác thông minh`} />
        <meta property="og:description" content="Tăng hiệu suất làm việc với Boversal – nền tảng quản lý dự án, nhắc việc và cộng tác thời gian thực." />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:image" content={OG_IMAGE} />

        {/* ===================== TWITTER CARD ===================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${APP_NAME} — Task management & Collaboration`} />
        <meta name="twitter:description" content="Nền tảng quản lý công việc hiện đại, dễ dùng và mạnh mẽ." />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* ===================== FAVICON ===================== */}
        {/* Favicon: serve SVG with explicit type and size hints so browsers rasterize larger */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg?${ASSET_VERSION}" />
        {/* Provide a sized icon hint (some browsers prefer PNG, but SVG with sizes helps) */}
        <link rel="icon" href="/logo.svg?${ASSET_VERSION}" sizes="128x128" />
        <link rel="apple-touch-icon" href="/logo.svg?${ASSET_VERSION}" sizes="128x128" />
        <link rel="shortcut icon" href="/logo.svg?${ASSET_VERSION}" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
