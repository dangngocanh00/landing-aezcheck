const paths = {
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  id: 'M3 5h18v14H3zM16 9h3m-3 4h3M11 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0M6 16c0-4 6-4 6 0',
  building: 'M5 21V3h14v18M2 21h20M9 7h1m4 0h1M9 11h1m4 0h1M10 21v-6h4v6',
  ads: 'm3 9 14-5v16L3 15zM3 9v6m4 1 2 5h3l-2-4M21 9v6',
  flag: 'M5 21V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0',
  check: 'm5 12 4 4L19 6',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  gift: 'M3 8h18v5H3zM5 13v8h14v-8M12 8v13M12 8C4 9 3 2 7 2c3 0 5 6 5 6Zm0 0c8 1 9-6 5-6-3 0-5 6-5 6Z',
  layers: 'm12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5',
  info: 'M12 11v6m0-10v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6',
  sparkle: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  chart: 'M4 19h17M7 15v-4m5 4V7m5 8V3',
}
export type PricingIconName = keyof typeof paths
export function PricingIcon({ name }: { name: PricingIconName }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
