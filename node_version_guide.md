> 📄 **Note**: You are currently viewing `node_version_guide.md`.

To return to the main project documentation, open [`Project-readme`](./README.md).


# Node.js Version Setup Guide

This project requires a specific Node.js version to ensure compatibility and stability.

## Required Node Version

```bash
22.15.0
```

We recommend using **NVM (Node Version Manager)** to install and switch to the correct Node version for this project.

---

## Step 1: Use `.nvmrc` File

This project contains a `.nvmrc` file with the correct Node.js version (`22.15.0`).

You can automatically switch to this version by running:

```bash
nvm use
```

If you don't have `nvm` installed, follow the instructions below based on your OS.

---

## Installation & Usage by OS

### macOS / Linux

1. **Install NVM**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. **Restart your terminal**, then verify:

```bash
nvm -v
```

3. **Use project’s Node version**:

```bash
cd your-project-folder
nvm use
```

4. If it’s not installed:

```bash
nvm install
```

---

### Windows (with Git Bash)

1. **Install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases/latest)**.

2. Add the following to your `~/.bashrc` or `~/.bash_profile` to expose NVM to Git Bash:

```bash
export NVM_HOME="/c/Program Files/nvm"
export PATH="$NVM_HOME:$PATH"
```

3. Restart Git Bash and verify:

```bash
nvm -v
```

4. Use Node version from `.nvmrc`:

```bash
cd project-root-folder
./use-node.sh
```

---

### Windows (with PowerShell)

1. Install `nvm-windows` from [nvm-windows GitHub Releases](https://github.com/coreybutler/nvm-windows/releases/latest).

2. In your PowerShell terminal, run:

```powershell
cd project-root-folder
./use-node.ps1
```


---

## Tip

If your terminal doesn't recognize `nvm`, make sure:
- It's installed correctly
- Your environment variables (`PATH`) are set properly

---

## Included Files

- `.nvmrc` – Specifies the required Node version.
- `use-node.sh` – Bash script for auto-switching Node version.
- `use-node.ps1` – PowerShell script for auto-switching on Windows.

---

## Summary

| Platform     | Command                         |
|--------------|----------------------------------|
| Linux/macOS  | `./use-node.sh`                        |
| Git Bash     | `./use-node.sh` *(with PATH fix)*      |
| PowerShell   | `./use-node.ps1`                |

---

### Need help?

If `nvm` is not recognized or Node isn’t switching correctly, double-check your `PATH` or refer to [NVM Docs](https://github.com/nvm-sh/nvm) or [nvm-windows Docs](https://github.com/coreybutler/nvm-windows).


> 📄 **Note**: You are currently viewing `node_version_guide.md`.

To return to the main project documentation, open [`Project-readme`](./README.md).
