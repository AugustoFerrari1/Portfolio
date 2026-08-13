'use client';

import { useEffect } from 'react';
import ErrorContent from '@/components/ErrorLayout';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for debugging if needed
    console.error('Unhandled app error:', error);
  }, [error]);

  return <ErrorContent type="generic" reset={reset} />;
}
