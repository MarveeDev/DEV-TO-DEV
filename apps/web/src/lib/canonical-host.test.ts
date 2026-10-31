import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeCanonicalHost,
  buildCanonicalRedirectUrl,
} from './canonical-host.ts';

test('normalizeCanonicalHost returns null when unset or empty', () => {
  assert.equal(normalizeCanonicalHost(undefined), null);
  assert.equal(normalizeCanonicalHost(''), null);
  assert.equal(normalizeCanonicalHost('   '), null);
});

test('normalizeCanonicalHost strips scheme and trailing slash', () => {
  assert.equal(normalizeCanonicalHost('devtodev.online'), 'devtodev.online');
  assert.equal(normalizeCanonicalHost('https://devtodev.online'), 'devtodev.online');
  assert.equal(normalizeCanonicalHost('https://devtodev.online/'), 'devtodev.online');
  assert.equal(normalizeCanonicalHost('http://devtodev.online/'), 'devtodev.online');
});

test('no canonical redirect when CANONICAL_HOST is unset', () => {
  assert.equal(
    buildCanonicalRedirectUrl('https://web-service-production-9eb3.up.railway.app/', 'web-service-production-9eb3.up.railway.app', null),
    null,
  );
});

test('no canonical redirect when CANONICAL_HOST is empty', () => {
  assert.equal(
    buildCanonicalRedirectUrl('https://web-service-production-9eb3.up.railway.app/', 'web-service-production-9eb3.up.railway.app', normalizeCanonicalHost('')),
    null,
  );
});

test('redirects a Railway domain to the configured canonical domain', () => {
  assert.equal(
    buildCanonicalRedirectUrl('https://web-service-production-9eb3.up.railway.app/', 'web-service-production-9eb3.up.railway.app', 'devtodev.online'),
    'https://devtodev.online/',
  );
});

test('preserves path and query string during canonical redirect', () => {
  assert.equal(
    buildCanonicalRedirectUrl('https://web-service-production-9eb3.up.railway.app/foo?x=1&y=2', 'web-service-production-9eb3.up.railway.app', 'devtodev.online'),
    'https://devtodev.online/foo?x=1&y=2',
  );
});

test('does not redirect a non-Railway host even when canonical host is set', () => {
  assert.equal(
    buildCanonicalRedirectUrl('https://devtodev.online/', 'devtodev.online', 'devtodev.online'),
    null,
  );
});
