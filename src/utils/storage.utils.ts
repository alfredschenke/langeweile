const STORAGE_PREFIX = 'asm-';

export function read<T>(key: string): T | undefined {
  const prefixedKey = `${STORAGE_PREFIX}${key}`;
  const value = localStorage.getItem(prefixedKey);
  return value ? JSON.parse(value) : undefined;
}

export function write<T>(key: string, value: T): void {
  const prefixedKey = `${STORAGE_PREFIX}${key}`;
  localStorage.setItem(prefixedKey, JSON.stringify(value));
}
