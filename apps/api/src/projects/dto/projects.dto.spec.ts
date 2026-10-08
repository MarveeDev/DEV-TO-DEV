import { ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

describe('Project DTO validation (SEC-003)', () => {
  describe('CreateProjectDto — URL validation', () => {
    it.each([
      'https://github.com/example/project',
      'https://example.com/demo',
      'http://example.com/demo',
    ])('accepts safe URL %s', async (url) => {
      const dto = Object.assign(new CreateProjectDto(), {
        title: 'T',
        description: 'D',
        githubUrl: url,
        demoUrl: url,
      });
      const errors = await validate(dto);
      const urlErrors = errors.filter(
        (e) => e.property === 'githubUrl' || e.property === 'demoUrl',
      );
      expect(urlErrors).toHaveLength(0);
    });

    it.each([
      'javascript:alert(1)',
      'javascript:void(0)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'JaVaScRiPt:alert(1)',
      '  javascript:alert(1)',
    ])('rejects dangerous URL %j', async (url) => {
      const dto = Object.assign(new CreateProjectDto(), {
        title: 'T',
        description: 'D',
        githubUrl: url,
      });
      const errors = await validate(dto);
      expect(errors.map((e) => e.property)).toContain('githubUrl');
    });

    it('requires title and description', async () => {
      const errors = await validate(Object.assign(new CreateProjectDto(), {}));
      const properties = errors.map((e) => e.property);
      expect(properties).toContain('title');
      expect(properties).toContain('description');
    });
  });

  describe('UpdateProjectDto — URL validation', () => {
    it.each([
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ])('rejects dangerous demoUrl %j', async (url) => {
      const dto = Object.assign(new UpdateProjectDto(), { demoUrl: url });
      const errors = await validate(dto);
      expect(errors.map((e) => e.property)).toContain('demoUrl');
    });

    it('accepts a safe githubUrl', async () => {
      const dto = Object.assign(new UpdateProjectDto(), {
        githubUrl: 'https://github.com/example/project',
      });
      const errors = await validate(dto);
      expect(errors.map((e) => e.property)).not.toContain('githubUrl');
    });

    it('allows empty and missing URLs', async () => {
      const empty = await validate(
        Object.assign(new UpdateProjectDto(), { githubUrl: '', demoUrl: '' }),
      );
      expect(empty.map((e) => e.property)).not.toContain('githubUrl');
      expect(empty.map((e) => e.property)).not.toContain('demoUrl');

      const missing = await validate(new UpdateProjectDto());
      expect(missing.map((e) => e.property)).not.toContain('githubUrl');
      expect(missing.map((e) => e.property)).not.toContain('demoUrl');
    });
  });

  describe('Mass-assignment protection (whitelist)', () => {
    const pipe = new ValidationPipe({ whitelist: true, transform: true });

    it('strips protected fields on create', async () => {
      const payload = {
        title: 'My Project',
        description: 'desc',
        githubUrl: 'https://github.com/x/y',
        ownerId: 'attacker-owner',
        slug: 'attacker-slug',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
        featured: true,
        moderationStatus: 'APPROVED',
      };
      const dto = (await pipe.transform(payload, {
        type: 'body',
        metatype: CreateProjectDto,
      })) as Record<string, unknown>;

      expect(dto.title).toBe('My Project');
      expect(dto.githubUrl).toBe('https://github.com/x/y');
      expect(dto.ownerId).toBeUndefined();
      expect(dto.slug).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
      expect(dto.featured).toBeUndefined();
      expect(dto.moderationStatus).toBeUndefined();
    });

    it('strips protected fields on update', async () => {
      const payload = {
        title: 'Updated',
        ownerId: 'attacker-owner',
        developerProfileId: 'attacker-profile',
        slug: 'attacker-slug',
        createdAt: '2020-01-01',
      };
      const dto = (await pipe.transform(payload, {
        type: 'body',
        metatype: UpdateProjectDto,
      })) as Record<string, unknown>;

      expect(dto.title).toBe('Updated');
      expect(dto.ownerId).toBeUndefined();
      expect(dto.developerProfileId).toBeUndefined();
      expect(dto.slug).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
    });
  });
});
