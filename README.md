# Claude Code Framework 🚀

The ultimate framework for supercharging your Claude Code workflow. Treat Claude as your brilliant, amnesiac coding partner and build amazing things together.

## ⚡ Features

- **Structured Memory Management** - Never lose context again with the memory-bank system
- **Checklist-Driven Development** - Transform requirements into executable Claude prompts
- **YOLO Mode** - All permissions maxed out for ultimate productivity
- **Large Codebase Support** - Map and index massive projects with knowledge graphs
- **Cross-AI Validation** - Get second opinions from other AI models
- **Session Management** - Seamless handoffs between coding sessions
- **Parallel Execution** - Leverage multi-agent workflows for speed

## 🚨 WARNING: YOLO Mode

This framework includes `settings.json` with **ALL PERMISSIONS ENABLED**. This means:
- Full filesystem access
- Unlimited token usage
- Parallel execution by default
- Auto-confirmations enabled

Use responsibly in development environments only!

## 🏃 Quick Start

```bash
# Install globally
npm install -g claude-code-framework

# Create a new project
claude init my-awesome-project --template web-app --yolo

# Start a session
cd my-awesome-project
claude session start

# Get your next task
claude task next
```

## 📚 Core Concepts

### The Amnesiac Expert Model

Claude Code is like a brilliant expert with short-term memory loss. This framework builds an external brain through:

1. **CLAUDE.md** - Core rules and constraints
2. **PLAN.md** - Checklist of executable prompts
3. **memory-bank/** - Persistent context storage

### Workflow Phases

1. **Planning** - Generate detailed implementation plans
2. **Implementation** - Execute tasks one at a time
3. **Review** - Cross-check with other AIs
4. **Session Management** - Clean handoffs between sessions

## 🛠️ Commands

### Project Management
```bash
claude init [name]              # Initialize new project
claude doctor                   # Diagnose setup issues
claude config set <key> <value> # Configure settings
```

### Development Workflow
```bash
claude plan generate <requirements.md>  # Generate implementation plan
claude task next                        # Show next task
claude task complete                    # Mark current task done
claude session start --restore-context  # Begin coding session
claude session end --update-memory      # End session cleanly
```

### Advanced Features
```bash
claude map-codebase --parallel-agents   # Map large codebases
claude context compact                  # Optimize context usage
claude review --ai gemini --security    # Cross-check code
```

## 📁 Project Structure

```
your-project/
├── CLAUDE.md              # Core rules (don't delete!)
├── PLAN.md                # Your implementation checklist
├── memory-bank/           # Claude's external brain
│   ├── projectBrief.md
│   ├── techContext.md
│   ├── systemPatterns.md
│   ├── activeContext.md
│   └── progress.md
├── .claude/               # Framework config
│   └── config.json
└── settings.json          # YOLO mode permissions
```

## 🎯 Best Practices

1. **One Task at a Time** - Focus prevents context pollution
2. **Commit Often** - Lock in progress with Git
3. **Review Like PRs** - Reject bad code entirely
4. **Update Memory** - Always update context before ending sessions
5. **Cross-Check Plans** - Use external AIs to validate

## 🔧 Configuration

### Enable YOLO Mode
```json
{
  "yolo": {
    "confirmations": {
      "skipAll": true,
      "autoYes": true
    }
  }
}
```

### MCP Servers
The framework supports multiple MCP servers:
- **basic-memory** - Simple note-based memory
- **graphiti** - Advanced knowledge graphs
- **sequential-thinking** - Deep analysis mode
- **puppeteer** - Browser automation

## 🚀 Magic Words

Add these to prompts for enhanced capabilities:
- `ultrathink` - Deep analysis mode
- `sub-task with agents` - Parallel processing

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📝 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

Built on the shoulders of giants and the collective wisdom of the Claude Code community.

---

**Remember**: Claude Code is your brilliant partner who just happens to forget everything between sessions. This framework is their memory palace. Use it wisely! 🧠✨