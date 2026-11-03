import type { Attachment } from "../attachments/attach";
import type { ProviderSession } from "./session";

/** Attachment kinds a model has to read natively (text files are sent as plain text). */
export type InputKind = "image" | "pdf";
export type Support = "yes" | "no" | "unknown";

/** What the provider's model list reported, kept with the session (never the key). */
export interface ModelInputs {
  images?: boolean;
  pdf?: boolean;
}

/**
 * Model families whose input support is stated in the provider's own docs. Anything not
 * listed is "unknown": the run still goes ahead, with a warning, and the provider decides.
 */
const families: {
  provider: ProviderSession["provider"];
  match: RegExp;
  image: Support;
  pdf: Support;
}[] = [
  // Text-only OpenAI models.
  { provider: "openai", match: /^(gpt-3\.5|o1-mini|o3-mini)/, image: "no", pdf: "no" },
  // Claude 3 and later read images; PDFs from 3.5 Sonnet on (3.0 models do not).
  { provider: "anthropic", match: /^claude-3-(opus|sonnet|haiku)-/, image: "yes", pdf: "no" },
  { provider: "anthropic", match: /^claude-(3-[57]|[a-z]+-[4-9])/, image: "yes", pdf: "yes" },
  { provider: "anthropic", match: /^claude-(2|instant)/, image: "no", pdf: "no" },
  // Gemini 1.5 and later read images and PDFs.
  { provider: "gemini", match: /^gemini-(1\.5|[2-9])/, image: "yes", pdf: "yes" },
];

export function inputSupport(
  session: Pick<ProviderSession, "provider" | "model"> & { inputs?: ModelInputs },
  kind: InputKind,
): Support {
  const reported = kind === "image" ? session.inputs?.images : session.inputs?.pdf;
  if (reported !== undefined) return reported ? "yes" : "no";
  const f = families.find((x) => x.provider === session.provider && x.match.test(session.model));
  return f ? (kind === "image" ? f.image : f.pdf) : "unknown";
}

export interface AttachmentCheck {
  /** Kinds the model is known not to read: the request is not sent. */
  blocked: InputKind[];
  /** Kinds nobody could confirm: the request is sent with a warning. */
  unsure: InputKind[];
}

/** BYOK-01: catch a model/attachment mismatch before anything is sent. */
export function checkAttachments(
  session: (Pick<ProviderSession, "provider" | "model"> & { inputs?: ModelInputs }) | null,
  attachments: Pick<Attachment, "kind">[],
): AttachmentCheck {
  const out: AttachmentCheck = { blocked: [], unsure: [] };
  if (!session) return out;
  for (const kind of ["image", "pdf"] as const) {
    if (!attachments.some((a) => a.kind === kind)) continue;
    const s = inputSupport(session, kind);
    if (s === "no") out.blocked.push(kind);
    else if (s === "unknown") out.unsure.push(kind);
  }
  return out;
}
