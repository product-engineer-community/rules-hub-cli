import { describe, it, expect } from "vitest";
import { parseCliArgs } from "../src/lib/options";

describe("CLI option parsing", () => {
  it("parses repoUrl and --token correctly", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "abc123",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.repoUrl).toBe("https://github.com/foo/bar");
    expect(result.token).toBe("abc123");
    expect(result.branch).toBeUndefined();
  });

  it("uses GITHUB_TOKEN from env when --token is not provided", () => {
    const argv = ["node", "cli", "https://github.com/foo/bar"];
    const result = parseCliArgs(argv, { GITHUB_TOKEN: "env-token" });
    expect(result.token).toBe("env-token");
  });

  it("prefers --token over GITHUB_TOKEN", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "cli-token",
    ];
    const result = parseCliArgs(argv, { GITHUB_TOKEN: "env-token" });
    expect(result.token).toBe("cli-token");
  });

  it("parses optional --branch", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--branch",
      "dev",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.branch).toBe("dev");
  });

  it("throws if repoUrl is missing", () => {
    expect(() => {
      parseCliArgs(["node", "cli"], {});
    }).toThrow();
  });

  it("parses --dry-run and --overwrite flags correctly", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "abc123",
      "--dry-run",
      "--overwrite",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.dryRun).toBe(true);
    expect(result.overwrite).toBe(true);
  });

  it("defaults dryRun and overwrite to false when not specified", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "abc123",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.dryRun).toBe(false);
    expect(result.overwrite).toBe(false);
  });

  it("parses --output option correctly", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "abc123",
      "--output",
      "configs/rules",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.output).toBe("configs/rules");
  });

  it("leaves output undefined if not provided", () => {
    const argv = [
      "node",
      "cli",
      "https://github.com/foo/bar",
      "--token",
      "abc123",
    ];
    const result = parseCliArgs(argv, {});
    expect(result.output).toBeUndefined();
  });
});
