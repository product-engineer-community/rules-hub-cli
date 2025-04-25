# 🛠️ rules-hub-cli

Copy `.cursor/rules` folder from any GitHub repository to your local project via CLI.

> Useful for sharing consistent development rules across multiple projects (e.g. lint, format, Cursor config, etc).

---

## 🚀 Installation

You can run the CLI directly with `npx`:

```bash
npx rules-hub-cli copy <repo-url> --token <your_token>
```

Or install globally:

```bash
pnpm add -g rules-hub-cli
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
- or `GITHUB_TOKEN` environment variable

---

## 📦 Usage

### Basic usage

```bash
rules-hub-cli copy https://github.com/your-org/config-repo --token ghp_xxx
```

### Use environment variable instead of flag

```bash
export GITHUB_TOKEN=ghp_xxx
rules-hub-cli copy https://github.com/your-org/config-repo
```

---

## ⚙️ CLI Options

| Option        | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `<repoUrl>`   | GitHub repository URL (required)                                              |
| `--token`     | GitHub personal access token (or use `GITHUB_TOKEN` env)                      |
| `--branch`    | Branch to search for `.cursor/rules` (defaults to `main` → fallback `master`) |
| `--output`    | Custom output directory (default: `.cursor/rules`)                            |
| `--dry-run`   | Preview files without actually saving them                                    |
| `--overwrite` | Overwrite existing files instead of skipping them                             |

---

## 💡 Examples

```bash
# Copy with default output (.cursor/rules)
rules-hub-cli copy https://github.com/boazhub/shared-config --token ghp_...

# Custom output path
rules-hub-cli copy https://github.com/boazhub/shared-config --output configs/rules --token ghp_...

# Dry run mode (no files will be written)
rules-hub-cli copy https://github.com/boazhub/shared-config --dry-run --token ghp_...

# Overwrite existing local files
rules-hub-cli copy https://github.com/boazhub/shared-config --overwrite --token ghp_...
```

---

## ✅ Test Connectivity (optional)

You can test your token and repo accessibility before copying:

```bash
rules-hub-cli test https://github.com/boazhub/shared-config --token ghp_...
```

---

## 🧪 Development & Testing

Install dev dependencies:

```bash
pnpm install
```

Run tests:

```bash
pnpm test
```

---

## 📝 License

MIT
