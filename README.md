# 🛠️ rules-hub-cli

Copy `.cursor/rules` folder from any GitHub repository to your local project via CLI.

> Useful for sharing consistent development rules across multiple projects (e.g. lint, format, Cursor config, etc).

---

## 🚀 Quick Start

You can run the CLI directly with `npx`:

```bash
npx rules-hub <repo-url> --token <your_token>
```

Or install globally:

```bash
npm install -g rules-hub-cli
```

Then use it anywhere:

```bash
rules-hub <repo-url> --token <your_token>
```

---

## 🔐 GitHub Token Requirement

To use this CLI, you must provide a **GitHub Personal Access Token (Classic)** with at least:

- `repo` permission (for private repos)
- `contents:read` access (for public repos)

Generate your token here:
👉 https://github.com/settings/tokens

> ⚠️ **Fine-grained tokens are not yet fully supported. Please use a classic token.**

You can pass the token via:

- `--token <your_token>` flag
- or set it once using an environment variable:

```bash
export GITHUB_TOKEN=ghp_xxx
```

---

## 📦 Usage

### Basic usage with token

```bash
npx rules-hub https://github.com/your-org/config-repo --token ghp_xxx
```

### Using `GITHUB_TOKEN` environment variable

```bash
export GITHUB_TOKEN=ghp_xxx
npx rules-hub https://github.com/your-org/config-repo
```

---

## ⚙️ CLI Options

| Option        | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| `<repoUrl>`   | GitHub repository URL (required)                                                |
| `--token`     | GitHub personal access token (or use `GITHUB_TOKEN` env)                        |
| `--branch`    | Branch to search for `.cursor/rules` (defaults to `main`, fallback to `master`) |
| `--output`    | Custom output directory (default: `.cursor/rules` in current working directory) |
| `--dry-run`   | Preview files without actually saving them                                      |
| `--overwrite` | Overwrite existing files instead of skipping them                               |

---

## 💡 Examples

```bash
# Copy with default output (.cursor/rules)
npx rules-hub https://github.com/boazhub/shared-config --token ghp_...

# Custom output path
npx rules-hub https://github.com/boazhub/shared-config --output configs/rules --token ghp_...

# Dry run mode (no files will be written)
npx rules-hub https://github.com/boazhub/shared-config --dry-run --token ghp_...

# Overwrite existing local files
npx rules-hub https://github.com/boazhub/shared-config --overwrite --token ghp_...

# All combined
npx rules-hub https://github.com/boazhub/shared-config \
  --output shared/config \
  --overwrite \
  --token ghp_...
```

---

## 🧪 Development & Testing

Install dev dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

---

## 📝 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project is licensed under the MIT License.
