const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

module.exports = async (options) => {
  const spinner = ora();
  
  try {
    const planPath = path.join(process.cwd(), 'PLAN.md');
    
    if (options.generate) {
      spinner.start('Generating plan from requirements...');
      
      const requirementsPath = path.resolve(options.generate);
      if (!await fs.pathExists(requirementsPath)) {
        throw new Error(`Requirements file not found: ${requirementsPath}`);
      }
      
      const requirements = await fs.readFile(requirementsPath, 'utf-8');
      
      let planPrompt = `Generate a detailed implementation plan in checklist format for:\n\n${requirements}\n\n`;
      
      if (options.ultrathink) {
        planPrompt += '\nUse ultrathink mode for deep analysis of requirements and dependencies.';
      }
      
      console.log(chalk.yellow('\nPlan generation prompt:'));
      console.log(chalk.gray(planPrompt));
      
      const planTemplate = `# Implementation Plan
Generated from: ${path.basename(requirementsPath)}
Generated at: ${new Date().toISOString()}

## Analysis
${options.ultrathink ? '[Deep analysis with ultrathink mode enabled]' : '[Standard analysis]'}

## Phase 1: Foundation
- [ ] Prompt: "Create the base project structure following ${path.basename(requirementsPath)} requirements"
- [ ] Prompt: "Set up core data models and schemas based on requirements"
- [ ] Prompt: "Write comprehensive tests for all core functionality"

## Phase 2: Core Implementation
- [ ] Prompt: "Implement primary features as specified in requirements"
- [ ] Prompt: "Create necessary API endpoints or UI components"
- [ ] Prompt: "Add data validation and error handling"

## Phase 3: Integration
- [ ] Prompt: "Connect all components and ensure proper data flow"
- [ ] Prompt: "Implement authentication and authorization if required"
- [ ] Prompt: "Add logging and monitoring capabilities"

## Phase 4: Testing & Optimization
- [ ] Prompt: "Run all tests and fix any failures"
- [ ] Prompt: "Perform integration testing"
- [ ] Prompt: "Optimize performance and remove bottlenecks"

## Phase 5: Documentation & Deployment
- [ ] Prompt: "Create necessary documentation"
- [ ] Prompt: "Set up deployment configuration"
- [ ] Prompt: "Final review and cleanup"

## Notes
- Each prompt should be executable by Claude Code
- Maintain TDD approach throughout
- Update memory-bank/progress.md after each phase
${options.crossCheck ? '- Plan will be cross-checked with external AI' : ''}
`;
      
      await fs.writeFile(planPath, planTemplate);
      spinner.succeed('Plan generated successfully!');
      
      if (options.crossCheck) {
        console.log(chalk.yellow('\nCross-check prompt for external AI:'));
        console.log(chalk.gray('Review this plan for potential issues, missing steps, or improvements.'));
      }
      
    } else {
      if (!await fs.pathExists(planPath)) {
        throw new Error('No PLAN.md found. Use --generate to create one.');
      }
      
      const plan = await fs.readFile(planPath, 'utf-8');
      const lines = plan.split('\n');
      const tasks = lines.filter(line => line.trim().startsWith('- [ ]'));
      const completed = lines.filter(line => line.trim().startsWith('- [x]'));
      
      console.log(chalk.cyan('\nPlan Status:'));
      console.log(chalk.green(`✓ Completed: ${completed.length}`));
      console.log(chalk.yellow(`○ Pending: ${tasks.length}`));
      console.log(chalk.gray(`━ Total: ${completed.length + tasks.length}`));
      
      if (tasks.length > 0) {
        console.log(chalk.cyan('\nNext task:'));
        console.log(tasks[0]);
      } else {
        console.log(chalk.green('\n✓ All tasks completed!'));
      }
    }
    
  } catch (error) {
    spinner.fail('Plan operation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};