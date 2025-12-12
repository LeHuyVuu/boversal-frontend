import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Login | Boversal',
  description: 'Sign in to your Boversal account to manage projects, tasks, and collaborate with your team.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Login | Boversal',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
