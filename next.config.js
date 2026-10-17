/** @type {import('next').NextConfig} */

// scripts/copy-maplibre.mjs serves MapLibre from /vendor/maplibre-gl@<version>; the map needs the same version
const { version: maplibreVersion } = require('maplibre-gl/package.json');

// A full CSP isn't practical: webcam images come from many external hosts and scripts would need nonces
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig = {
  poweredByHeader: false,
  env: {
    MAPLIBRE_VERSION: maplibreVersion,
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // The folder name changes with every MapLibre version, so the files never change in place
      { source: '/vendor/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};

module.exports = nextConfig;
