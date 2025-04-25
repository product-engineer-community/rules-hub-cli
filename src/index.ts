#!/usr/bin/env node
import { parseCliArgs } from "./lib/options.js";
import { validateParsedOptions } from "./lib/validateOptions.js";
import { GitHubClient, fetchFolderContents, saveFiles } from "./lib/github.js";
import path from "path";
import chalk from "chalk";

const options = parseCliArgs(process.argv, process.env);
validateParsedOptions(options);

(async () => {
  const wasTokenProvided = !!options.token;
  const client = new GitHubClient(options.token);
  const branches = options.branch ? [options.branch] : ["main", "master"];
  const localDir = path.resolve(
    process.cwd(),
    options.output || ".cursor/rules"
  );

  for (const branch of branches) {
    try {
      const files = await fetchFolderContents(
        client,
        options.repoUrl,
        branch,
        wasTokenProvided
      );
      if (!files) {
        console.log(
          chalk.yellow(`⚠️  .cursor/rules not found in branch '${branch}'.`)
        );
        continue;
      }

      if (files.length === 0) {
        console.log(
          chalk.yellow(`⚠️  .cursor/rules is empty in branch '${branch}'.`)
        );
        continue;
      }

      await saveFiles(client, files, localDir, {
        dryRun: options.dryRun,
        overwrite: options.overwrite,
      });

      console.log(
        options.dryRun
          ? chalk.green(`✅ Dry-run complete for branch '${branch}'.`)
          : chalk.green(
              `✅ All files copied to '${localDir}' from branch '${branch}'.`
            )
      );
      process.exit(0);
    } catch (err: any) {
      console.error(chalk.red("❌ Unexpected error:"), err.message);
      process.exit(1);
    }
  }

  console.error(
    chalk.red("❌ .cursor/rules folder not found in any checked branches.")
  );
  process.exit(1);
})();
