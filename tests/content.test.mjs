import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("ships every guide chapter as editable MDX", async () => {
  const files = (await readdir(new URL("../content/", import.meta.url))).filter((f) => f.endsWith(".mdx"));
  assert.equal(files.length, 29);
  for (const file of files) {
    const text = await readFile(new URL(`../content/${file}`, import.meta.url), "utf8");
    assert.match(text, /^## /m, `${file} needs a section heading`);
    assert.ok(text.length > 450, `${file} is unexpectedly short`);
  }
});

test("removes starter preview metadata and dependencies", async () => {
  const [page, layout, pkg] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page + layout + pkg, /codex-preview|SkeletonPreview|react-loading-skeleton/);
  assert.match(layout, /Old PC to Minecraft Server/);
});
