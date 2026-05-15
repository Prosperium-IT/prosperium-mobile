import { uuidv7 } from 'uuidv7'

export function generateExternalId(): string {
  return uuidv7()
}

export function generateIdempotencyKey(): string {
  return uuidv7()
}
