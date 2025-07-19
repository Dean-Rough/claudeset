#!/usr/bin/env node

const { Command } = require('commander');
// const chalk = require('chalk');
const chalk = {
  cyan: { bold: (s) => s },
  yellow: { bold: (s) => s },
  green: (s) => s,
  red: (s) => s,
  gray: (s) => s
};
const { version } = require('../package.json');

const program = new Command();

console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════╗
║   Claude Code Framework v${version}      ║
║   🚀 YOLO Mode Engaged 🚀            ║
╚═══════════════════════════════════════╝
`));

program
  .name('claude')
  .description('Ultimate Claude Code workflow framework')
  .version(version);

program
  .command('init [name]')
  .description('Initialize a new Claude Code project')
  .option('-t, --template <type>', 'Project template', 'web-app')
  .option('-s, --stack <stack>', 'Technology stack', 'react-fastapi')
  .option('--yolo', 'Enable YOLO mode (all permissions)', true)
  .option('--size <size>', 'Project size (small|medium|large)', 'medium')
  .option('--mcp <provider>', 'MCP provider (basic-memory|graphiti|none)', 'basic-memory')
  .action((name, options) => {
    require('./commands/init')(name, options);
  });

program
  .command('plan')
  .description('Generate or manage project plans')
  .option('-g, --generate <file>', 'Generate plan from requirements file')
  .option('--ultrathink', 'Enable deep analysis mode')
  .option('--cross-check', 'Validate with external AI')
  .option('--checklist', 'Enforce checklist format', true)
  .action((options) => {
    require('./commands/plan')(options);
  });

program
  .command('session <action>')
  .description('Manage Claude Code sessions (start|end|status)')
  .option('--restore-context', 'Restore context from memory bank')
  .option('--update-memory', 'Update memory files on end')
  .option('--commit', 'Create git commit on end')
  .option('--show-progress', 'Display current progress')
  .action((action, options) => {
    require('./commands/session')(action, options);
  });

program
  .command('context [action]')
  .description('Manage context and memory (status|compact|reset)')
  .option('--warn-threshold <percent>', 'Warning threshold', '50')
  .option('--preserve-current', 'Preserve current task on compact')
  .option('--force', 'Force action without confirmation')
  .action((action, options) => {
    require('./commands/context')(action || 'status', options);
  });

program
  .command('map-codebase')
  .description('Map large codebase to knowledge graph')
  .option('--parallel-agents', 'Use parallel processing', true)
  .option('--knowledge-graph', 'Store in configured MCP', true)
  .option('--sections', 'Auto-identify logical sections', true)
  .option('--verify', 'Run verification phase', true)
  .action((options) => {
    require('./commands/map-codebase')(options);
  });

program
  .command('task [action]')
  .description('Task management (next|list|complete)')
  .option('--auto-review', 'Show review checklist')
  .option('--test-first', 'Enforce TDD')
  .action((action, options) => {
    require('./commands/task')(action || 'next', options);
  });

program
  .command('review [target]')
  .description('Cross-check code or plans with external AI (plan|code|all)')
  .option('--ai <provider>', 'AI provider (gemini|gpt4|claude)', 'gemini')
  .option('--security', 'Include security review')
  .option('--performance', 'Include performance review')
  .action((target, options) => {
    require('./commands/review')(target || 'all', options);
  });

program
  .command('doctor')
  .description('Diagnose and fix Claude Code setup issues')
  .option('--fix', 'Automatically fix issues')
  .option('--verbose', 'Show detailed diagnostics')
  .action((options) => {
    require('./commands/doctor')(options);
  });

program
  .command('config [action]')
  .description('Manage Claude Code configuration (show|set|reset)')
  .option('--key <key>', 'Configuration key')
  .option('--value <value>', 'Configuration value')
  .option('--global', 'Apply globally')
  .action((action, options) => {
    require('./commands/config')(action || 'show', options);
  });

if (process.argv.includes('--yolo')) {
  console.log(chalk.yellow.bold('⚡ YOLO MODE ACTIVATED - All safeties disengaged! ⚡\n'));
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}