# Claude Code Workflows Guide

## Core Workflows

### 1. New Project Workflow

Starting a fresh project from scratch:

```bash
# Step 1: Initialize project
claude init awesome-app --template web-app --stack react-fastapi --yolo

# Step 2: Navigate and set up
cd awesome-app

# Step 3: Generate plan from requirements
claude plan generate requirements.md --ultrathink --cross-check

# Step 4: Start first session
claude session start --restore-context

# Step 5: Execute first task
claude task next
# Copy the task prompt to Claude Code

# Step 6: Complete and continue
claude task complete
claude task next
```

### 2. Daily Development Workflow

Your standard development routine:

```bash
# Morning: Start session
claude session start --restore-context --show-progress

# Check context usage
claude context status

# Get current task
claude task next

# Work on tasks...
# When context gets high:
claude context compact --preserve-current

# Evening: End session
claude session end --update-memory --commit
```

### 3. Large Codebase Onboarding

For existing projects over 100MB:

```bash
# Step 1: Initialize in existing project
cd large-project
claude init . --size large --mcp graphiti

# Step 2: Map the codebase
claude map-codebase --parallel-agents --knowledge-graph

# Step 3: Use this prompt in Claude:
"Map this entire codebase using parallel agents via the task tool.
Phase 1: Identify all sections
Phase 2: Index each section in parallel
Phase 3: Store in knowledge graph"

# Step 4: Verify mapping
claude doctor --verbose
```

### 4. TDD Development Workflow

Test-driven development approach:

```bash
# Configure for TDD
claude config set testFirst true

# Get task with TDD reminder
claude task next --test-first

# Workflow:
# 1. Write failing test first
# 2. Run test to verify failure
# 3. Implement minimal code to pass
# 4. Refactor if needed
# 5. Mark task complete

claude task complete
```

### 5. Cross-AI Review Workflow

Getting second opinions on your code:

```bash
# After implementing features
claude review plan --ai gemini --cross-check

# For security-critical code
claude review code --ai gpt4 --security

# Full review
claude review all --performance --security
```

### 6. Emergency Recovery Workflow

When things go wrong:

```bash
# Diagnose issues
claude doctor --verbose

# Auto-fix problems
claude doctor --fix

# Reset context if corrupted
claude context reset --force

# Restore from last good state
git checkout HEAD~1
claude session start --restore-context
```

## Advanced Workflows

### Multi-Agent Development

For complex features requiring parallel work:

```bash
# In your prompt to Claude:
"Implement user authentication system.
Use sub-task with agents to parallelize:
- Agent 1: Create database models
- Agent 2: Build API endpoints  
- Agent 3: Design frontend components
- Agent 4: Write integration tests"
```

### Continuous Planning

Evolving plans as you learn:

```bash
# Review current plan
claude plan

# Edit PLAN.md manually as needed
# Or regenerate sections:
claude plan generate new-requirements.md --ultrathink

# Plans can be living documents!
```

### Session Handoffs

Transferring work between team members:

```bash
# Person A finishes work
claude session end --update-memory --commit
git push

# Person B starts
git pull
claude session start --restore-context
# Reviews activeContext.md and progress.md
```

### Performance Optimization Workflow

```bash
# 1. Baseline measurement
claude task next  # "Profile current performance"

# 2. Identify bottlenecks
claude review code --performance

# 3. Implement optimizations
# Use "ultrathink" for complex optimizations

# 4. Measure improvements
# Compare before/after metrics
```

## Workflow Tips & Tricks

### Context Management

**Early Warning System:**
```bash
# Add to your shell profile
alias cs='claude context status'
```

**Automatic Compaction:**
```bash
claude config set autoCompact true
claude config set compactThreshold 70
```

### Task Batching

Group similar tasks for efficiency:

```bash
# Edit PLAN.md to group related items
# Then use parallel agents:
"Complete all model creation tasks using parallel agents"
```

### Memory Patterns

**Pattern 1: Breadcrumbs**
Always leave notes in activeContext.md about:
- What you just completed
- Any decisions made
- Next logical step

**Pattern 2: Decision Log**
Create `memory-bank/decisions.md` for:
- Architecture choices
- Library selections
- Important trade-offs

### Git Integration

**Auto-commit on task completion:**
```bash
# Create alias
alias ctc='claude task complete && git add -A && git commit -m "Task completed"'
```

**Branch per feature:**
```bash
git checkout -b feature/auth
claude session start
# Work on feature
claude session end --commit
git checkout main
```

## Common Patterns

### The "Morning Standup"
```bash
claude session start
claude task list
claude context status
# Review yesterday's progress
cat memory-bank/progress.md | tail -20
```

### The "Context Squeeze"
When approaching context limits:
1. Complete current thought
2. Compact context
3. Restate current task
4. Continue working

### The "Checkpoint Pattern"
Before risky operations:
```bash
git add -A && git commit -m "Checkpoint before refactor"
claude session end --update-memory
# Do risky work
# If it fails: git reset --hard HEAD
```

## Debugging Workflows

### When Claude Gets Confused

1. **Stop immediately** - Don't compound confusion
2. **Update activeContext.md** - Clarify current state
3. **Compact context** - Remove noise
4. **Restate goal** - Clear, simple prompt
5. **Resume** - From clean state

### When Tests Fail

```bash
# 1. Get clear error message
npm test 2>&1 | head -50

# 2. Update context with error
echo "Current error: [error details]" >> memory-bank/activeContext.md

# 3. Ask Claude to analyze with full context
"The test is failing with this error. Let's trace through the code."
```

### When Performance Degrades

Signs of context overload:
- Repetitive responses
- Forgetting recent changes  
- Slower responses
- Irrelevant suggestions

Fix:
```bash
claude context compact --preserve-current
# Then restate: "We're working on [specific task]. The current state is..."
```

## Best Practices Summary

1. **Start Clean** - Always `session start` with context restore
2. **End Clean** - Always `session end` with memory update  
3. **One Task** - Focus on single tasks to prevent context pollution
4. **Commit Often** - Lock in progress with Git
5. **Review Regularly** - Cross-check important code
6. **Document Decisions** - Future you will thank present you
7. **Trust the Process** - The framework handles the complexity

---

Remember: Claude Code is your brilliant partner. The framework is their memory. Together, you're unstoppable! 🚀