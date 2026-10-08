import { validate } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

async function validateProfile(patch: {
  websiteUrl?: string;
  githubUrl?: string;
}): Promise<string[]> {
  const dto = Object.assign(new UpdateProfileDto(), patch);
  const errors = await validate(dto);
  return errors.map((e) => e.property);
}

describe('UpdateProfileDto URL validation (SEC-002)', () => {
  it.each([
    'https://example.com',
    'https://github.com/test',
    'https://www.example.com/profile',
    'http://example.com',
  ])('accepts safe websiteUrl %s', async (url) => {
    const properties = await validateProfile({ websiteUrl: url });
    expect(properties).not.toContain('websiteUrl');
  });

  it.each([
    'javascript:alert(1)',
    'javascript:void(0)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
  ])('rejects dangerous websiteUrl %j', async (url) => {
    const properties = await validateProfile({ websiteUrl: url });
    expect(properties).toContain('websiteUrl');
  });

  it('accepts safe githubUrl', async () => {
    const properties = await validateProfile({
      githubUrl: 'https://github.com/test',
    });
    expect(properties).not.toContain('githubUrl');
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ])('rejects dangerous githubUrl %j', async (url) => {
    const properties = await validateProfile({ githubUrl: url });
    expect(properties).toContain('githubUrl');
  });

  it('allows empty and missing URLs (clear behavior preserved)', async () => {
    const empty = await validateProfile({ websiteUrl: '', githubUrl: '' });
    expect(empty).not.toContain('websiteUrl');
    expect(empty).not.toContain('githubUrl');

    const missing = await validateProfile({});
    expect(missing).not.toContain('websiteUrl');
    expect(missing).not.toContain('githubUrl');
  });
});
