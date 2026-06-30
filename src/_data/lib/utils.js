import crypto from "node:crypto";

export const hashText = (rawNotTrimmedText) => {
  // Use raw text for the hash, not trimmed. This is how the summarizer works.
  return crypto.createHash("sha256").update(rawNotTrimmedText).digest("hex");
};
