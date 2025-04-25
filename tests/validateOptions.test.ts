import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { validateParsedOptions } from "../src/lib/validateOptions";
import chalk from "chalk";
import type { ParsedOptions } from "../src/lib/options";

describe("validateParsedOptions", () => {
  const originalExit = process.exit;
  const originalError = console.error;

  beforeEach(() => {
    // mock exit and console.error
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exits if repoUrl is missing", () => {
    const options = { token: "abc123" } as ParsedOptions;
    expect(() => validateParsedOptions(options)).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      chalk.red("❌ Please provide a GitHub repository URL.")
    );
  });

  it("exits if token is missing", () => {
    const options = { repoUrl: "https://github.com/foo/bar" } as ParsedOptions;
    expect(() => validateParsedOptions(options)).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      chalk.red(
        "❌ GitHub Personal Access Token is required. Use --token or set GITHUB_TOKEN."
      )
    );
  });

  it("passes if repoUrl and token are present", () => {
    const options: ParsedOptions = {
      repoUrl: "https://github.com/foo/bar",
      token: "abc123",
    };
    expect(() => validateParsedOptions(options)).not.toThrow();
  });
});
