import * as fs from 'fs';
import * as path from 'path';

describe('Cloudinary video delivery CSP', () => {
  const nextConfigPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'apps',
    'web',
    'next.config.ts',
  );

  it('allows Cloudinary-hosted videos via the media-src directive', () => {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    expect(content).toMatch(/media-src\s+'self'\s+https:\/\/res\.cloudinary\.com/);
  });
});
