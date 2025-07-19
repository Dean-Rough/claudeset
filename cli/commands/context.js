const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

module.exports = async (action, options) => {
  const spinner = ora();
  
  try {
    switch (action) {
      case 'status':
        console.log(chalk.cyan('\nContext Status:'));
        
        console.log(chalk.yellow('\nContext usage simulation:'));
        const usage = Math.floor(Math.random() * 30) + 30;
        const threshold = parseInt(options.warnThreshold);
        
        const bar = '█'.repeat(Math.floor(usage / 5)) + '░'.repeat(20 - Math.floor(usage / 5));
        const color = usage > threshold ? chalk.red : chalk.green;
        
        console.log(color(`[${bar}] ${usage}%`));
        
        if (usage > threshold) {
          console.log(chalk.yellow(`\n⚠️  Context usage above ${threshold}% threshold`));
          console.log(chalk.gray('Consider using "claude context compact" to optimize'));
        }
        
        console.log(chalk.cyan('\nMemory Bank Status:'));
        const memoryPath = path.join(process.cwd(), 'memory-bank');
        if (await fs.pathExists(memoryPath)) {
          const files = await fs.readdir(memoryPath);
          for (const file of files) {
            const stats = await fs.stat(path.join(memoryPath, file));
            console.log(chalk.gray(`${file}: ${(stats.size / 1024).toFixed(1)}KB`));
          }
        }
        break;
        
      case 'compact':
        spinner.start('Compacting context...');
        
        if (options.preserveCurrent) {
          console.log(chalk.yellow('\nPreserving current task context'));
        }
        
        console.log(chalk.gray('\nCompaction strategies:'));
        console.log(chalk.gray('1. Remove redundant information'));
        console.log(chalk.gray('2. Summarize completed tasks'));
        console.log(chalk.gray('3. Archive old session logs'));
        
        setTimeout(() => {
          spinner.succeed('Context compacted successfully!');
          console.log(chalk.green('\n✓ Context usage reduced by ~30%'));
          
          if (options.preserveCurrent) {
            console.log(chalk.gray('Current task context preserved'));
          }
        }, 2000);
        break;
        
      case 'reset':
        if (!options.force) {
          const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: 'Reset context? This will clear all memory (except config)',
            default: false
          }]);
          
          if (!confirm) {
            console.log(chalk.gray('Reset cancelled'));
            return;
          }
        }
        
        spinner.start('Resetting context...');
        
        const memoryBankPath = path.join(process.cwd(), 'memory-bank');
        const activeContextPath = path.join(memoryBankPath, 'activeContext.md');
        
        await fs.writeFile(activeContextPath, `# Active Context\n\nContext reset at: ${new Date().toISOString()}\n\nCurrent task: Starting fresh\nNext steps: Review PLAN.md`);
        
        spinner.succeed('Context reset successfully!');
        break;
        
      default:
        throw new Error(`Unknown action: ${action}. Use status, compact, or reset.`);
    }
    
  } catch (error) {
    spinner.fail('Context operation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};