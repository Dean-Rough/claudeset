# Claude Code Framework Setup Guide

## Prerequisites

- Node.js 16+ 
- Git
- Claude Code Desktop App or VS Code Extension
- (Optional) MCP server dependencies

## Installation

### 1. Install the Framework

```bash
# Clone the repository
git clone https://github.com/Dean-Rough/claudeset.git
cd claudeset

# Install dependencies
npm install

# Link globally for CLI access
npm link
```

### 2. Configure Claude Code

Copy the YOLO `settings.json` to your Claude Code configuration:

**Mac/Linux:**
```bash
cp settings.json ~/Library/Application\ Support/Claude/settings.json
```

**Windows:**
```bash
copy settings.json %APPDATA%\Claude\settings.json
```

### 3. Install MCP Servers (Optional but Recommended)

```bash
# Basic Memory (Simple note storage)
npm install -g @basicmachines/mcp-memory

# Graphiti (Knowledge graphs) - Requires Neo4j
npm install -g @getzep/graphiti-mcp

# Sequential Thinking (Enhanced reasoning)
npm install -g mcp-sequential-thinking
```

## Environment Setup

### For Graphiti Knowledge Graph

1. Install Neo4j:
```bash
# Mac
brew install neo4j

# Or use Docker
docker run -p 7474:7474 -p 7687:7687 neo4j
```

2. Set environment variables:
```bash
export NEO4J_URI=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=your-password
export OPENAI_API_KEY=your-openai-key
```

### For Web Search & Scraping

```bash
export EXA_API_KEY=your-exa-key
export FIRECRAWL_API_KEY=your-firecrawl-key
```

## First Project Setup

### 1. Create Your First Project

```bash
claude init my-first-project --template web-app --yolo
cd my-first-project
```

### 2. Verify Installation

```bash
claude doctor --verbose
```

This checks:
- ✓ Project structure
- ✓ Memory bank files
- ✓ Git repository
- ✓ Configuration
- ✓ YOLO settings

### 3. Start Your First Session

```bash
# Start a new session
claude session start --restore-context

# Check your first task
claude task next

# When done working
claude session end --update-memory
```

## Troubleshooting

### "Command not found: claude"

```bash
# Ensure npm bin is in PATH
export PATH=$PATH:$(npm bin -g)

# Or reinstall globally
npm install -g claude-code-framework
```

### MCP Server Connection Issues

1. Check Claude Code logs:
   - Mac: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\Logs\`

2. Verify MCP server is running:
```bash
# Test basic-memory
npx @basicmachines/mcp-memory --version
```

### Permission Errors

If you see permission errors with YOLO mode:

1. Check settings.json is properly loaded
2. Restart Claude Code after configuration changes
3. Run `claude doctor --fix` to auto-repair

## Advanced Configuration

### Custom Templates

Add your own templates:

```bash
# Copy existing template
cp -r templates/web-app templates/my-template

# Edit template files
# Templates are used by: claude init --template my-template
```

### Git Hooks

Install automated session management:

```bash
# From project root
sh hooks/install.sh
```

This adds:
- Pre-commit: Update memory files
- Post-checkout: Restore context

### Global Configuration

Set defaults for all projects:

```bash
claude config set defaultTemplate react-fastapi --global
claude config set yoloMode true --global
claude config set crossCheckAI gemini --global
```

## Security Notes

⚠️ **YOLO Mode Security**

The included settings.json grants:
- Full filesystem access (read/write/delete)
- Unlimited command execution
- No confirmation prompts

**Recommendations:**
1. Only use in isolated development environments
2. Never use on production systems
3. Review all generated code before deployment
4. Keep sensitive data out of project directories

## Next Steps

1. Read the [Workflows Guide](WORKFLOWS.md)
2. Review [Best Practices](BEST_PRACTICES.md)
3. Join the community discussions
4. Build something amazing!

---

Need help? Run `claude doctor` or check the [troubleshooting guide](https://github.com/Dean-Rough/claudeset/wiki/Troubleshooting).