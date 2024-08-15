// src/utils/assert.ts
export function assertIsDefined<T>(val: T | undefined | null, errorMessage: string): asserts val is T {
    if (val === undefined || val === null) {
      throw new Error(errorMessage);
    }
  }
  