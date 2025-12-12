'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals-primereact.css";
import { Providers } from '@/components/Providers';
import GoogleAnalytics from '@/components/GoogleAnalytics';
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
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // Add a small cache-busting version to force browsers to fetch updated icons
  const ASSET_VERSION = 'v7';
  const OG_IMAGE = `${APP_URL}/og-image.svg?${ASSET_VERSION}`;
  const LOGO_SVG = `${APP_URL}/logo.svg?${ASSET_VERSION}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
        
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="color-scheme" content="dark light" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Boversal là nền tảng quản lý dự án toàn diện với theo dõi task, lịch làm việc, tài liệu và tính năng cộng tác nhóm. Tối ưu hóa quy trình và tăng năng suất với Agile, Scrum, Kanban." />
        <meta name="keywords" content="quản lý dự án, task tracking, cộng tác nhóm, agile, scrum, kanban, năng suất, workflow, lập kế hoạch dự án, quản lý task, lịch làm việc, cuộc họp, tài liệu, theo dõi thời gian, pomodoro, project management, collaboration" />
        <meta name="author" content="Boversal Team" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <link rel="canonical" href={APP_URL} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:title" content={`${APP_NAME} — Quản lý công việc & cộng tác thông minh`} />
        <meta property="og:description" content="Tăng hiệu suất làm việc với Boversal – nền tảng quản lý dự án, nhắc việc và cộng tác thời gian thực." />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Boversal Project Management Platform" />
        <meta property="og:locale" content="vi_VN" />

        {/* ===================== TWITTER CARD ===================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${APP_NAME} — Task management & Collaboration`} />
        <meta name="twitter:description" content="Nền tảng quản lý công việc hiện đại, dễ dùng và mạnh mẽ." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:site" content="@boversal" />
        <meta name="twitter:creator" content="@boversal" />

        {/* ===================== FAVICON ===================== */}
        {/* Favicon: serve SVG with explicit type and size hints so browsers rasterize larger */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg?${ASSET_VERSION}" />
        {/* Provide a sized icon hint (some browsers prefer PNG, but SVG with sizes helps) */}
        <link rel="icon" href="/logo.svg?${ASSET_VERSION}" sizes="128x128" />
        <link rel="apple-touch-icon" href="/logo.svg?${ASSET_VERSION}" sizes="128x128" />
        <link rel="shortcut icon" href="/logo.svg?${ASSET_VERSION}" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
