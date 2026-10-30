import type { NextConfig } from 'next';

const pages = process.env.PAGES_BUILD === 'true';
const basePath = pages ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
const config: NextConfig = {
  poweredByHeader: false,
  ...(pages
    ? { output: 'export', basePath, trailingSlash: true, images: { unoptimized: true } }
    : {
        async headers() {
          return [{ source: '/(.*)', headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ] }];
        },
      }),
};
export default config;
