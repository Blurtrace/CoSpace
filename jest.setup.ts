import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';

Object.assign(global, { TextEncoder, TextDecoder });

if (typeof window !== 'undefined') {
  Object.assign(window, { TextEncoder, TextDecoder });
  Object.defineProperty(window, 'crypto', {
    value: webcrypto,
    writable: true,
  });
}
