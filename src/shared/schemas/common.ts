import { BadRequestError } from '../errors/bad-request-error';

export function requireString(value: unknown, field: string, options: { min?: number; max?: number; allowEmpty?: boolean } = {}): string {
  if (typeof value !== 'string') {
    throw new BadRequestError(`${field} deve ser uma string`);
  }
  const trimmed = value.trim();
  if (!options.allowEmpty && trimmed.length === 0) {
    throw new BadRequestError(`${field} é obrigatório`);
  }
  if (options.min !== undefined && trimmed.length < options.min) {
    throw new BadRequestError(`${field} deve ter pelo menos ${options.min} caracteres`);
  }
  if (options.max !== undefined && trimmed.length > options.max) {
    throw new BadRequestError(`${field} deve ter no máximo ${options.max} caracteres`);
  }
  return trimmed;
}

export function requireEmail(value: unknown): string {
  const email = requireString(value, 'email', { min: 5, max: 160 });
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    throw new BadRequestError('email inválido');
  }
  return email.toLowerCase();
}

export function optionalString(value: unknown, field: string, options: { max?: number } = {}): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new BadRequestError(`${field} deve ser uma string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (options.max !== undefined && trimmed.length > options.max) {
    throw new BadRequestError(`${field} deve ter no máximo ${options.max} caracteres`);
  }
  return trimmed;
}

export function optionalUuid(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    throw new BadRequestError(`${field} deve ser uma string`);
  }
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!pattern.test(value)) {
    throw new BadRequestError(`${field} inválido`);
  }
  return value;
}
