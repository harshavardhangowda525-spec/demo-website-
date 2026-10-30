/** Public files need the project prefix on GitHub Pages. */
export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${path.replace(/^\//, '')}`;
}
