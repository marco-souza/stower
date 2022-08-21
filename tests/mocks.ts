import { Logging } from "@services/logging.ts";
import { Shell } from "@services/stow.ts";

export const logging: Logging = {
  debug: () => null,
  error: () => null,
  info: () => null,
  warn: () => null,
}

export const sh: Shell = (...args: any[]) => Promise.resolve({})
