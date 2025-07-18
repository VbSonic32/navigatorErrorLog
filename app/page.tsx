'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the logs page
    router.push('/logs');
  }, [router]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '70vh' }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="ms-2">Redirecting to Error Logs...</div>
    </div>
  );
}
