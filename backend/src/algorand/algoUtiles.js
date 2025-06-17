import { Buffer } from 'node:buffer';
import { TextDecoder } from 'node:util';

export function toNote(json) {
  const str = JSON.stringify(json);
  return new TextEncoder().encode(str);
}

export function fromNote(base64) {
  const bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
  const str = new TextDecoder().decode(bytes);
  return JSON.parse(str);
}