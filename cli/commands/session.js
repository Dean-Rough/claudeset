const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

module.exports = async (action, options) => {
  const spinner = ora();
  const memoryBankPath = path.join(process.cwd(), 'memory-bank');
  
  try {
    switch (action) {
      case 'start':
        spinner.start('Starting Claude Code session...');
        
        if (!await fs.pathExists(memoryBankPath)) {
          throw new Error('No memory-bank found. Are you in a Claude Code project?');
        }
        
        if (options.restoreContext) {
          console.log(chalk.yellow('\nRestoring context from memory bank...'));
          
          const files = ['CLAUDE.md', 'PLAN.md'];
          const memoryFiles = await fs.readdir(memoryBankPath);
          
          for (const file of [...files, ...memoryFiles.map(f => path.join('memory-bank', f))]) {
            const filePath = path.join(process.cwd(), file);
            if (await fs.pathExists(filePath)) {
              console.log(chalk.gray(`Reading: ${file}`));
            }
          }
        }
        
        const activeContext = await fs.readFile(path.join(memoryBankPath, 'activeContext.md'), 'utf-8');
        const progress = await fs.readFile(path.join(memoryBankPath, 'progress.md'), 'utf-8');
        
        spinner.succeed('Session started successfully!');
        
        console.log(chalk.cyan('\nActive Context:'));
        console.log(chalk.gray(activeContext.split('\n').slice(2, 5).join('\n')));
        
        if (options.showProgress) {
          console.log(chalk.cyan('\nProgress:'));
          console.log(chalk.gray(progress.split('\n').slice(2, 10).join('\n')));
        }
        
        console.log(chalk.yellow('\nSession ready. Use "claude task next" to see your next task.'));
        break;
        
      case 'end':
        spinner.start('Ending Claude Code session...');
        
        if (options.updateMemory) {
          const timestamp = new Date().toISOString();
          const sessionLog = `\n\n## Session ended: ${timestamp}\n`;
          
          await fs.appendFile(path.join(memoryBankPath, 'activeContext.md'), sessionLog);
          
          console.log(chalk.yellow('\nMemory update prompts:'));
          console.log(chalk.gray('1. Update activeContext.md with current work state'));
          console.log(chalk.gray('2. Update progress.md with completed tasks'));
          console.log(chalk.gray('3. Note any blockers or next steps'));
        }
        
        if (options.commit) {
          try {
            const status = execSync('git status --porcelain', { encoding: 'utf-8' });
            if (status) {
              execSync('git add -A');
              const message = `Session checkpoint: ${new Date().toISOString()}`;
              execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
              console.log(chalk.green('\n✓ Changes committed'));
            } else {
              console.log(chalk.gray('\nNo changes to commit'));
            }
          } catch (error) {
            console.log(chalk.yellow('\nGit commit failed - save your work manually'));
          }
        }
        
        spinner.succeed('Session ended successfully!');
        break;
        
      case 'status':
        if (!await fs.pathExists(memoryBankPath)) {
          console.log(chalk.red('✗ Not in a Claude Code project'));
          return;
        }
        
        console.log(chalk.cyan('\nSession Status:'));
        
        const configPath = path.join(process.cwd(), '.claude/config.json');
        if (await fs.pathExists(configPath)) {
          const config = await fs.readJSON(configPath);
          console.log(chalk.gray(`Project: ${path.basename(process.cwd())}`));
          console.log(chalk.gray(`Template: ${config.template}`));
          console.log(chalk.gray(`Stack: ${config.stack}`));
          console.log(chalk.gray(`Created: ${new Date(config.created).toLocaleDateString()}`));
        }
        
        const planPath = path.join(process.cwd(), 'PLAN.md');
        if (await fs.pathExists(planPath)) {
          const plan = await fs.readFile(planPath, 'utf-8');
          const total = (plan.match(/- \[[ x]\]/g) || []).length;
          const completed = (plan.match(/- \[x\]/g) || []).length;
          console.log(chalk.gray(`Progress: ${completed}/${total} tasks (${Math.round(completed/total*100)}%)`));
        }
        
        const logsPath = path.join(process.cwd(), '.claude/logs');
        if (await fs.pathExists(logsPath)) {
          const logs = await fs.readdir(logsPath);
          console.log(chalk.gray(`Sessions: ${logs.length}`));
        }
        
        break;
        
      default:
        throw new Error(`Unknown action: ${action}. Use start, end, or status.`);
    }
    
  } catch (error) {
    spinner.fail('Session operation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};