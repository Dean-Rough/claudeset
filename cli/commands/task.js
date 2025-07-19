const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

module.exports = async (action, options) => {
  const spinner = ora();
  const planPath = path.join(process.cwd(), 'PLAN.md');
  
  try {
    if (!await fs.pathExists(planPath)) {
      throw new Error('No PLAN.md found. Run "claude plan generate" first.');
    }
    
    const planContent = await fs.readFile(planPath, 'utf-8');
    const lines = planContent.split('\n');
    
    switch (action) {
      case 'next':
        const nextTask = lines.find(line => line.trim().startsWith('- [ ]'));
        
        if (!nextTask) {
          console.log(chalk.green('✓ All tasks completed! 🎉'));
          return;
        }
        
        console.log(chalk.cyan('\nNext Task:'));
        console.log(chalk.white(nextTask));
        
        const taskIndex = lines.indexOf(nextTask);
        const phase = lines.slice(0, taskIndex).reverse().find(line => line.startsWith('##'));
        if (phase) {
          console.log(chalk.gray(`\nPhase: ${phase.replace('##', '').trim()}`));
        }
        
        if (options.autoReview) {
          console.log(chalk.yellow('\nReview Checklist:'));
          console.log(chalk.gray('□ Code follows project conventions'));
          console.log(chalk.gray('□ Error handling implemented'));
          console.log(chalk.gray('□ Tests written (if applicable)'));
          console.log(chalk.gray('□ No hardcoded values'));
          console.log(chalk.gray('□ Performance considered'));
        }
        
        if (options.testFirst) {
          console.log(chalk.red('\n⚠️  TDD Mode: Write tests BEFORE implementation!'));
        }
        break;
        
      case 'list':
        const allTasks = lines.filter(line => line.trim().match(/^- \[[ x]\]/));
        const completed = allTasks.filter(line => line.includes('[x]'));
        const pending = allTasks.filter(line => line.includes('[ ]'));
        
        console.log(chalk.cyan('\nTask Overview:'));
        console.log(chalk.green(`✓ Completed: ${completed.length}`));
        console.log(chalk.yellow(`○ Pending: ${pending.length}`));
        console.log(chalk.gray(`━ Total: ${allTasks.length}`));
        console.log(chalk.blue(`◉ Progress: ${Math.round(completed.length / allTasks.length * 100)}%`));
        
        if (pending.length > 0) {
          console.log(chalk.cyan('\nPending Tasks:'));
          pending.slice(0, 5).forEach((task, index) => {
            console.log(chalk.gray(`${index + 1}. ${task.trim()}`));
          });
          if (pending.length > 5) {
            console.log(chalk.gray(`   ... and ${pending.length - 5} more`));
          }
        }
        break;
        
      case 'complete':
        const currentTask = lines.find(line => line.trim().startsWith('- [ ]'));
        
        if (!currentTask) {
          console.log(chalk.gray('No pending tasks to complete'));
          return;
        }
        
        spinner.start('Marking task as complete...');
        
        const updatedPlan = planContent.replace(currentTask, currentTask.replace('[ ]', '[x]'));
        await fs.writeFile(planPath, updatedPlan);
        
        spinner.succeed('Task marked as complete!');
        
        const progressPath = path.join(process.cwd(), 'memory-bank/progress.md');
        if (await fs.pathExists(progressPath)) {
          const timestamp = new Date().toISOString();
          const progressUpdate = `\n- [x] ${currentTask.replace('- [ ]', '').trim()} (${timestamp})`;
          await fs.appendFile(progressPath, progressUpdate);
        }
        
        const remaining = updatedPlan.match(/- \[ \]/g);
        if (remaining) {
          console.log(chalk.gray(`\n${remaining.length} tasks remaining`));
        } else {
          console.log(chalk.green('\n🎉 All tasks completed!'));
        }
        break;
        
      default:
        throw new Error(`Unknown action: ${action}. Use next, list, or complete.`);
    }
    
  } catch (error) {
    spinner.fail('Task operation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};