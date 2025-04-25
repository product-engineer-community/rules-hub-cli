// src/lib/github.test.ts
import { describe, it, expect } from "vitest";
import { normalizeRepoUrl, buildApiUrl } from "../src/lib/github";

describe("normalizeRepoUrl", () => {
  it("removes .git and trailing slash", () => {
    const input = "https://github.com/foo/bar.git";
    const output = normalizeRepoUrl(input);
    expect(output).toBe("foo/bar");
  });

  it("removes trailing slash", () => {
    const input = "https://github.com/foo/bar/";
    const output = normalizeRepoUrl(input);
    expect(output).toBe("foo/bar");
  });
});

describe("buildApiUrl", () => {
  it("builds the correct GitHub API URL", () => {
    const url = buildApiUrl("https://github.com/foo/bar.git", "main");
    expect(url).toBe(
      "https://api.github.com/repos/foo/bar/contents/.cursor/rules?ref=main"
    );
  });
});
