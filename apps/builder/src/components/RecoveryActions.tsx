"use client";

import Link from "next/link";
import type { ProviderStrings } from "../i18n/providers";
import { recoveryFor } from "../providers/recovery";
import type { StreamError } from "../providers/stream";

/** BYOK-07: the next step after a provider error, next to its message. */
export function RecoveryActions({
  code,
  retry,
  settings,
  t,
  disabled,
  className,
}: {
  code: StreamError;
  retry: () => void;
  settings: string;
  t: ProviderStrings;
  disabled?: boolean;
  className?: string;
}) {
  const r = recoveryFor(code);
  if (!r.retry && !r.setup) return null;
  return (
    <>
      {r.retry ? (
        <>
          {" "}
          <button type="button" className={className} onClick={retry} disabled={disabled}>
            {t.retry}
          </button>
        </>
      ) : null}
      {r.setup ? (
        <>
          {" "}
          <Link className={className} href={settings}>
            {t.changeProvider}
          </Link>
        </>
      ) : null}
    </>
  );
}
