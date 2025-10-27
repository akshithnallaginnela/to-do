'use client';

import dynamic from 'next/dynamic';

// Disable SSR for the component that uses localStorage
const DSAApp = dynamic(() => import('../components/DSAApp'), { ssr: false });

export default function Home() {
  return <DSAApp />;
}
