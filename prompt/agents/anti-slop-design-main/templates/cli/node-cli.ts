/**
 * Node CLI template using @clack/prompts and picocolors.
 * Interactive multi-step prompt flow with styled output.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";

/* THEME: replace colors with domain palette */
const theme = {
  primary: pc.cyan,
  success: pc.green,
  error: pc.red,
  muted: pc.dim,
  accent: pc.magenta,
  bold: pc.bold,
};

const useColor = !process.env.NO_COLOR && !process.env.FORCE_NO_COLOR;
const c = (fn: (s: string) => string, text: string) =>
  useColor ? fn(text) : text;

/* THEME: replace banner text with domain name */
function printBanner() {
  const title = "  my-tool v1.0.0  ";
  const width = title.length + 2;
  const top = `╭${"─".repeat(width)}╮`;
  const mid = `│ ${title} │`;
  const bot = `╰${"─".repeat(width)}╯`;

  console.log(c(theme.primary, top));
  console.log(c(theme.primary, mid));
  console.log(c(theme.primary, bot));
  console.log();
}

/* Braille spinner frames */
const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function brailleSpinner(message: string): { stop: (msg?: string) => void } {
  let i = 0;
  const id = setInterval(() => {
    const frame = c(theme.accent, spinnerFrames[i % spinnerFrames.length]);
    process.stdout.write(`\r${frame} ${message}`);
    i++;
  }, 80);

  return {
    stop(doneMsg?: string) {
      clearInterval(id);
      process.stdout.write(
        `\r${c(theme.success, "✓")} ${doneMsg ?? message}\n`
      );
    },
  };
}

async function main() {
  printBanner();

  p.intro(c(theme.bold, "Project setup"));

  const name = await p.text({
    message: "What is your project name?",
    placeholder: "my-project",
    validate: (v) => (v.length === 0 ? "Name is required" : undefined),
  });
  if (p.isCancel(name)) return exit();

  /* THEME: replace select options with domain-specific choices */
  const template = await p.select({
    message: "Pick a template",
    options: [
      { value: "minimal", label: "Minimal", hint: "bare bones" },
      { value: "standard", label: "Standard", hint: "recommended" },
      { value: "full", label: "Full", hint: "everything included" },
    ],
  });
  if (p.isCancel(template)) return exit();

  const confirm = await p.confirm({
    message: `Create ${c(theme.primary, String(name))} with ${String(template)} template?`,
  });
  if (p.isCancel(confirm) || !confirm) return exit();

  const spin = brailleSpinner("Scaffolding project...");
  await sleep(1500);
  spin.stop("Project scaffolded");

  const spin2 = brailleSpinner("Installing dependencies...");
  await sleep(2000);
  spin2.stop("Dependencies installed");

  p.outro(
    `${c(theme.success, "✓")} Done! Run ${c(theme.muted, `cd ${String(name)} && npm start`)}`
  );
}

function exit() {
  p.outro(c(theme.error, "✗ Cancelled"));
  process.exit(0);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error(c(theme.error, `✗ ${err.message}`));
  process.exit(1);
});
