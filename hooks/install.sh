#!/bin/bash
# Install Claude Code Git hooks

echo "Installing Claude Code Git hooks..."

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPT_DIR="$(dirname "$0")"

# Copy pre-commit hook
if [ -f "$SCRIPT_DIR/pre-commit" ]; then
    cp "$SCRIPT_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo "✓ Installed pre-commit hook"
fi

# Copy post-checkout hook
if [ -f "$SCRIPT_DIR/post-checkout" ]; then
    cp "$SCRIPT_DIR/post-checkout" "$HOOKS_DIR/post-checkout"
    chmod +x "$HOOKS_DIR/post-checkout"
    echo "✓ Installed post-checkout hook"
fi

echo "
Git hooks installed successfully!

These hooks will:
- Update memory bank before commits
- Remind you to restore context after branch switches

To uninstall, delete the hook files from .git/hooks/
"