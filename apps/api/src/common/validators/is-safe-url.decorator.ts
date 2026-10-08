import {
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

const ALLOWED_URL_SCHEMES = new Set(['http', 'https']);

/**
 * Checks whether a URL uses only the http/https protocol, rejecting dangerous
 * schemes such as javascript:, data:, and vbscript: (including case and
 * whitespace variations). Empty/null values are allowed.
 */
export function isSafeExternalUrl(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (trimmed === '') return true;

  const match = /^([a-z][a-z0-9+.\-]*):/i.exec(trimmed);
  if (!match) return false;

  const scheme = match[1].toLowerCase();
  return ALLOWED_URL_SCHEMES.has(scheme);
}

/**
 * class-validator decorator enforcing the http/https URL allowlist. Rejects
 * dangerous URL schemes (javascript:, data:, vbscript:, etc.) before
 * persistence.
 */
export function IsSafeUrl(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isSafeUrl',
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate: (value: unknown) => isSafeExternalUrl(value),
        defaultMessage: () => 'URL must use the http or https protocol',
      },
    });
  };
}
