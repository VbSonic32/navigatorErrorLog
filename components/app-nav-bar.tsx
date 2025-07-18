'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppNavBar() {
  const pathname = usePathname();

  // Helper function to determine if a route is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link href="/" className="navbar-brand">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error Log
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/logs"
                className={isActive('/logs') ? 'nav-link active' : 'nav-link'}
                aria-current={isActive('/logs') ? 'page' : undefined}
              >
                Logs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className={isActive('/about') ? 'nav-link active' : 'nav-link'}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
