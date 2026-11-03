import type { StreamError } from "./stream";

/** What the user can do next after a provider error (BYOK-07). */
export interface Recovery {
  /** Sending the same request again can work (limits, outages, dropped streams). */
  retry: boolean;
  /** The key, the account or the model has to change first: open the provider settings. */
  setup: boolean;
}

export function recoveryFor(code: StreamError): Recovery {
  switch (code) {
    case "invalid-key":
    case "no-models":
    case "rejected":
      return { retry: false, setup: true };
    case "billing":
      return { retry: true, setup: true }; // after adding credit, the same request works
    case "aborted":
      return { retry: false, setup: false };
    default:
      return { retry: true, setup: false };
  }
}
