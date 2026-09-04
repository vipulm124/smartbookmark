import assert from "node:assert/strict";
import {
  categorizeContent,
  detectContentType,
  processSharePayload,
} from "../src/services/categorizer";

function test(name: string, fn: () => void) {
  fn();
  console.log(`✓ ${name}`);
}

test("detects GitHub as technical", () => {
  const url = "https://github.com/facebook/react";
  assert.equal(
    categorizeContent(url, "React repository", "Open source UI library"),
    "technical"
  );
});

test("detects Instagram reel as entertainment reel", () => {
  const url = "https://www.instagram.com/reel/ABC123/";
  assert.equal(detectContentType(url, ""), "reel");
  assert.equal(
    categorizeContent(url, "Funny dance reel", "viral trending"),
    "entertainment"
  );
});

test("detects YouTube video as entertainment", () => {
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  assert.equal(detectContentType(url, ""), "video");
  assert.equal(
    categorizeContent(url, "Music video", "entertainment"),
    "entertainment"
  );
});

test("detects Stack Overflow as technical", () => {
  const url = "https://stackoverflow.com/questions/123/how-to-use-react";
  assert.equal(
    categorizeContent(url, "How to use React hooks", "javascript programming"),
    "technical"
  );
});

test("processes share payload with URL in text", () => {
  const result = processSharePayload({
    text: "Check this out https://dev.to/some/article about TypeScript",
  });
  assert.equal(result.category, "technical");
  assert.ok(result.url.includes("dev.to"));
});

console.log("\nAll categorizer tests passed!");
