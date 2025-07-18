const nextConfig = {
  // only needed when deploying to Azure static web app
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encoresstgproposalstst01.blob.core.windows.net',
        port: '',
        pathname: '/staticassets/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'https://proposal-editor.test.psav.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'proposal-editor.test.psav.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-assets.test.psav.com', // Hardcoded hostname
        port: '',
        pathname: '/**', // Pathname for static-assets.test.psav.com
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encoresstgproposalstrn01.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-assets.training.psav.com', // Hardcoded hostname
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.brandfolder.io', // Corrected hostname
        port: '',
        pathname: '/**', // Pathname for static-assets.psav.com
      },
    ],
  },
};

export default nextConfig;
