// src/cli/validate.ts
import chalk from "chalk";
import { ParsedOptions } from "./options";

export function validateParsedOptions(options: ParsedOptions) {
  if (!options.repoUrl) {
    console.error(chalk.red("❌ Please provide a GitHub repository URL."));
    process.exit(1);
  }

  if (!options.token) {
    console.error(
      chalk.red(
        "❌ GitHub Personal Access Token is required. Use --token or set GITHUB_TOKEN."
      )
    );
    process.exit(1);
  }
}
