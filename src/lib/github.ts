// src/lib/github.ts ----------------------------------------------------------
import axios, { AxiosInstance } from "axios";
import fs from "fs";
import path from "path";
import chalk from "chalk";

/* ----------------------------------------------------------------- *
 * 1) pure functions: normalize repo URL & build API URL              *
 * ----------------------------------------------------------------- */
export function normalizeRepoUrl(input: string): string {
  return input
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
}
export function buildApiUrl(repoUrl: string, branch: string): string {
  const repoPath = normalizeRepoUrl(repoUrl);
  return `https://api.github.com/repos/${repoPath}/contents/.cursor/rules?ref=${branch}`;
}

/* ----------------------------------------------------------------- *
 * 2) GitHub HTTP client wrapper                                     *
 * ----------------------------------------------------------------- */
export class GitHubClient {
  private axios: AxiosInstance;
  constructor(token: string) {
    this.axios = axios.create({
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
  get<T>(url: string) {
    return this.axios.get<T>(url);
  }
}

/* ----------------------------------------------------------------- *
 * 3) folder search logic                                             *
 * ----------------------------------------------------------------- */
export async function fetchFolderContents(
  client: GitHubClient,
  repoUrl: string,
  branch: string,
  wasTokenProvided: boolean
) {
  const apiUrl = buildApiUrl(repoUrl, branch);
  console.log(chalk.gray(`🚀  GET ${apiUrl}`));

  try {
    const res = await client.get<Array<GitHubFile>>(apiUrl);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 403 || err.response?.status === 404) {
      console.error(
        chalk.red(`❌ Failed to access .cursor/rules on branch '${branch}'.`)
      );
      if (!wasTokenProvided) {
        console.log(
          chalk.yellow(
            `💡 This may be a private repository. Try providing a GitHub token using --token or GITHUB_TOKEN env.`
          )
        );
      }
      return null;
    }
    throw err;
  }
}

/* ----------------------------------------------------------------- *
 * 4) file download & save                                           *
 * ----------------------------------------------------------------- */
export async function saveFiles(
  client: GitHubClient,
  files: GitHubFile[],
  outputDir: string,
  options: { dryRun?: boolean; overwrite?: boolean } = {}
) {
  fs.mkdirSync(outputDir, { recursive: true });

  const existingFiles = new Set(
    fs.existsSync(outputDir) ? fs.readdirSync(outputDir) : []
  );

  for (const file of files) {
    if (file.type !== "file") continue;

    const alreadyExists = existingFiles.has(file.name);
    const filePath = path.join(outputDir, file.name);

    if (alreadyExists && !options.overwrite) {
      console.log(chalk.gray(`📦 Skipped (already exists): ${file.name}`));
      continue;
    }

    if (options.dryRun) {
      console.log(
        chalk.cyan(
          `🔍 [Dry-run] Would ${alreadyExists ? "overwrite" : "add"}: ${
            file.name
          }`
        )
      );
      continue;
    }

    const { data } = await client.get<string>(file.download_url);
    fs.writeFileSync(filePath, data, "utf-8");
    console.log(
      alreadyExists
        ? chalk.yellow(`✏️  Overwritten: ${file.name}`)
        : chalk.blue(`📄 Added: ${file.name}`)
    );
  }
}

/* ----------------------------------------------------------------- *
 * 5) 타입 선언                                                       *
 * ----------------------------------------------------------------- */
interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string;
}
