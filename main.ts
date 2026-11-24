import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One Emoji, One Smile — the entry is exactly one emoji: the sun with a
// face (U+1F31E). A smiling sun reads as pure warmth at first glance to a
// stranger of any age or background, it is a deliberate pick rather than
// the default smiley, and it carries no intimacy, irony or flirtation.
const ENTRY = "🌞";

// The gate accepts UTF-8 text of 1 to 8 characters that is not only white
// space, and the brief asks for exactly one emoji. Fail loudly before
// writing anything if the entry ever drifts from that shape, so a bad
// edit is caught here instead of being silently judged as invalid.
function validate(entry: string): void {
  const graphemes = [...new Intl.Segmenter().segment(entry)];
  if (graphemes.length !== 1) {
    throw new Error(`entry must be exactly one emoji, got ${graphemes.length} graphemes`);
  }
  const chars = [...entry].length;
  if (chars < 1 || chars > 8 || entry.trim().length === 0) {
    throw new Error(`entry must be 1-8 non-whitespace characters, got ${chars}`);
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, ENTRY, "utf8");
  // Read the file back and compare byte for byte: a truncated or
  // corrupted write must fail loudly here, not at the gate.
  const written = readFileSync(outFile, "utf8");
  if (written !== ENTRY) {
    throw new Error(`written output does not match entry: ${JSON.stringify(written)}`);
  }
  console.log(`wrote entry: ${ENTRY}`);
}

try {
  main();
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
