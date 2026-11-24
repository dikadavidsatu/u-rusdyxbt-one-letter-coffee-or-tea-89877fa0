import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One Letter: Coffee or Tea.
// The whole entry is a single letter: "A" stands for coffee.
// It is the first letter of the alphabet, the top grade, and the
// shortest possible way to pick the bolder drink — no hedging,
// no explanation, just the choice itself.
const ENTRY = "A";

function validate(text: string): void {
  if (typeof text !== "string") {
    throw new Error("entry must be a string");
  }
  // Count code points, not UTF-16 code units, so a surrogate pair
  // can never slip through as a "single" character.
  const chars = [...text];
  if (chars.length !== 1) {
    throw new Error(`entry must be exactly 1 character, got ${chars.length}`);
  }
  if (text !== "A" && text !== "B") {
    throw new Error(`entry must be "A" (coffee) or "B" (tea), got ${JSON.stringify(text)}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // The gate counts characters in a UTF-8 file: a valid letter is
  // exactly one byte on disk, with no newline or padding around it.
  if (Buffer.byteLength(text, "utf8") !== 1) {
    throw new Error("entry must encode to exactly 1 UTF-8 byte");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must contain no line breaks");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts characters, so the file
  // must hold the letter and nothing else.
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
