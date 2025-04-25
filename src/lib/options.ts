import { Command } from "commander";

export interface ParsedOptions {
  repoUrl: string;
  token: string;
  branch?: string;
  dryRun?: boolean;
  overwrite?: boolean;
  output?: string;
}

export function parseCliArgs(
  argv: string[],
  env: NodeJS.ProcessEnv
): ParsedOptions {
  const program = new Command();

  let result: ParsedOptions = {
    repoUrl: "",
    token: "",
  };

  program
    .name("rules-hub")
    .argument("<repoUrl>", "GitHub repository URL")
    .option("-t, --token <token>", "GitHub token")
    .option("-b, --branch <branch>", "Branch to use")
    .option("--dry-run", "Preview files without saving them")
    .option("--overwrite", "Force overwrite existing files")
    .option(
      "--output <path>",
      "Target directory to save files (default: .cursor/rules)"
    )
    .allowUnknownOption(true)
    .action((repoUrl: string, options) => {
      result = {
        repoUrl,
        token: options.token || env.GITHUB_TOKEN || "",
        branch: options.branch,
        dryRun: options.dryRun ?? false,
        overwrite: options.overwrite ?? false,
        output: options.output,
      };
    });

  program.parse(argv);
  return result;
}
