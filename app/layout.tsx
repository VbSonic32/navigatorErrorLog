import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import Script from 'next/script';
import AppNavBar from '@/components/app-nav-bar';
import AppFooter from '@/components/app-footer';

export const metadata: Metadata = {
  title: 'Error Log Explorer',
  description: 'Application for exploring error logs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/next.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        ></link>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
          integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
          crossOrigin="anonymous"
        />
      </head>
      <body className={'d-flex flex-column min-vh-100'}>
        <AppNavBar />
        <main className="flex-grow-1 container-fluid my-3 page-transition">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}
