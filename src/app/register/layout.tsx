import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Register | Boversal',
  description: 'Create your free Boversal account. Start managing projects, tasks, and collaborating with your team today.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Register | Boversal',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/register`,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
