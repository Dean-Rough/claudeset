const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

module.exports = async (projectName, options) => {
  const spinner = ora();
  
  try {
    if (!projectName) {
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: 'claude-project'
      }]);
      projectName = name;
    }

    const projectPath = path.join(process.cwd(), projectName);
    
    spinner.start(`Creating project ${chalk.cyan(projectName)}...`);
    
    await fs.ensureDir(projectPath);
    
    await fs.ensureDir(path.join(projectPath, 'memory-bank'));
    await fs.ensureDir(path.join(projectPath, '.claude'));
    await fs.ensureDir(path.join(projectPath, '.claude/logs'));
    
    const claudeMd = `# Project Rules for Claude Code

## Core Principles
1. Development MUST follow TDD methodology
2. All implementation MUST follow steps in PLAN.md
3. Tech stack: ${options.stack} - do NOT introduce other libraries unless specified

## Code Standards
- Follow established conventions in the codebase
- Error handling: Always handle edge cases
- Testing: Minimum 80% coverage
- No comments unless explicitly requested

## Session Rules
- One task at a time from PLAN.md
- Commit after each working feature
- Update memory-bank/ before ending session

## YOLO Mode
- All permissions enabled
- Parallel execution by default
- Auto-confirmations active
`;

    await fs.writeFile(path.join(projectPath, 'CLAUDE.md'), claudeMd);
    
    const planMd = `# Implementation Plan

## Phase 1: Foundation
- [ ] Prompt: "Set up the basic project structure with ${options.template} template"
- [ ] Prompt: "Create initial models/schemas for the application"
- [ ] Prompt: "Write failing tests for core functionality"

## Phase 2: Core Features
- [ ] Prompt: "Implement core business logic with TDD approach"
- [ ] Prompt: "Create API endpoints/UI components as needed"
- [ ] Prompt: "Add integration tests"

## Phase 3: Polish
- [ ] Prompt: "Add error handling and validation"
- [ ] Prompt: "Implement logging and monitoring"
- [ ] Prompt: "Performance optimization and cleanup"
`;

    await fs.writeFile(path.join(projectPath, 'PLAN.md'), planMd);
    
    const memoryFiles = {
      'projectBrief.md': `# Project Brief\n\n${projectName} - A ${options.template} application built with ${options.stack}.`,
      'techContext.md': `# Technology Context\n\nStack: ${options.stack}\nTemplate: ${options.template}\nSize: ${options.size}\nMCP: ${options.mcp}`,
      'systemPatterns.md': `# System Patterns\n\n- Architecture: [To be defined]\n- Design patterns: [To be defined]\n- Key conventions: [To be defined]`,
      'activeContext.md': `# Active Context\n\nCurrent task: Project initialization\nNext steps: Review PLAN.md and begin implementation`,
      'progress.md': `# Progress Tracking\n\n## Completed\n- [x] Project initialization\n\n## In Progress\n- [ ] Phase 1: Foundation\n\n## Upcoming\n- [ ] Phase 2: Core Features\n- [ ] Phase 3: Polish`
    };
    
    for (const [filename, content] of Object.entries(memoryFiles)) {
      await fs.writeFile(path.join(projectPath, 'memory-bank', filename), content);
    }
    
    const claudeConfig = {
      version: '1.0.0',
      template: options.template,
      stack: options.stack,
      size: options.size,
      mcp: options.mcp,
      yolo: options.yolo,
      created: new Date().toISOString(),
      settings: {
        contextWarningThreshold: 50,
        autoCommit: true,
        parallelExecution: true,
        crossCheckAI: 'gemini'
      }
    };
    
    await fs.writeJSON(path.join(projectPath, '.claude/config.json'), claudeConfig, { spaces: 2 });
    
    const gitignore = `# Claude Code Framework
.claude/logs/
.claude-cache/
*.log
.env
.env.local
node_modules/
dist/
build/
coverage/
.DS_Store
`;
    
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
    await fs.writeFile(path.join(projectPath, '.claudeignore'), gitignore);
    
    const templatePath = path.join(__dirname, '../../templates', options.template);
    if (await fs.pathExists(templatePath)) {
      await fs.copy(templatePath, projectPath, { overwrite: false });
    }
    
    if (options.yolo) {
      const settingsPath = path.join(__dirname, '../../settings.json');
      await fs.copy(settingsPath, path.join(projectPath, 'settings.json'));
    }
    
    spinner.succeed(`Project ${chalk.green(projectName)} created successfully!`);
    
    console.log('\n' + chalk.yellow('Next steps:'));
    console.log(chalk.gray('1.') + ` cd ${projectName}`);
    console.log(chalk.gray('2.') + ' claude session start');
    console.log(chalk.gray('3.') + ' claude task next\n');
    
    if (options.yolo) {
      console.log(chalk.red.bold('⚡ YOLO MODE: All permissions enabled in settings.json ⚡\n'));
    }
    
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};