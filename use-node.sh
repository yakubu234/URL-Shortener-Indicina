#!/bin/bash

# Ensure .nvmrc exists
if [ ! -f ".nvmrc" ]; then
  echo ".nvmrc not found"
  exit 1
fi

# Read the target Node.js version from .nvmrc
TARGET_NODE_VERSION=$(cat .nvmrc)

# Get the current Node.js version
CURRENT_NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')

# Save current global npm packages with versions (handling Windows compatibility)
if [ -n "$CURRENT_NODE_VERSION" ]; then
  echo "Saving current global npm packages for Node $CURRENT_NODE_VERSION..."
  npm list -g --depth=0 --json | grep -oP '"name":.*?[^\\]",\s*"version":.*?[^\\]"' | sed 's/"name": "\(.*\)", "version": "\(.*\)"/\1@\2/' > "globals-$CURRENT_NODE_VERSION.txt"
else
  echo "No active Node version detected — skipping save."
fi

# Switch to the target Node version
echo "Switching to Node.js $TARGET_NODE_VERSION..."
nvm use "$TARGET_NODE_VERSION"
if [ $? -ne 0 ]; then
  echo "Failed to switch Node version."
  exit 1
fi

# Restore global npm packages if saved list exists
if [ -f "globals-$TARGET_NODE_VERSION.txt" ]; then
  echo "Restoring global npm packages for Node $TARGET_NODE_VERSION..."
  while read pkg; do
    echo "Installing $pkg..."
    npm install -g "$pkg"
  done < "globals-$TARGET_NODE_VERSION.txt"
else
  echo "No globals-$TARGET_NODE_VERSION.txt found — skipping global npm install."
fi
