const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

module.exports = async (target, options) => {
  const spinner = ora();
  
  try {
    console.log(chalk.cyan(`\nReview Configuration:`));
    console.log(chalk.gray(`Target: ${target}`));
    console.log(chalk.gray(`AI Provider: ${options.ai}`));
    console.log(chalk.gray(`Security review: ${options.security ? 'Yes' : 'No'}`));
    console.log(chalk.gray(`Performance review: ${options.performance ? 'Yes' : 'No'}`));
    
    const reviewPrompts = {
      gemini: {
        plan: `As a senior engineer, critically review this implementation plan. Identify:
1. Missing steps or dependencies
2. Potential technical risks
3. Better approaches or alternatives
4. Security considerations
5. Performance implications`,
        code: `Review this code for:
1. Best practices violations
2. Security vulnerabilities
3. Performance issues
4. Maintainability concerns
5. Testing gaps`
      },
      gpt4: {
        plan: `Analyze this plan from an experienced architect's perspective. Consider:
- Scalability implications
- Technical debt risks
- Integration challenges
- Alternative solutions`,
        code: `Perform a thorough code review focusing on:
- Code quality and clarity
- Error handling
- Security best practices
- Performance optimization opportunities`
      },
      claude: {
        plan: `Cross-examine this plan for completeness and feasibility. Question assumptions and identify blind spots.`,
        code: `Review for correctness, efficiency, and adherence to best practices.`
      }
    };
    
    switch (target) {
      case 'plan':
        spinner.start('Preparing plan for review...');
        
        const planPath = path.join(process.cwd(), 'PLAN.md');
        if (!await fs.pathExists(planPath)) {
          throw new Error('No PLAN.md found');
        }
        
        const plan = await fs.readFile(planPath, 'utf-8');
        
        spinner.succeed('Plan ready for review!');
        
        console.log(chalk.yellow('\nReview Instructions:'));
        console.log(chalk.gray('1. Copy your PLAN.md content'));
        console.log(chalk.gray(`2. Open ${options.ai} (or another AI)`));
        console.log(chalk.gray('3. Use this prompt:'));
        console.log(chalk.cyan('\n' + reviewPrompts[options.ai].plan));
        console.log(chalk.gray('\n4. Paste your plan after the prompt'));
        console.log(chalk.gray('5. Update PLAN.md based on feedback'));
        break;
        
      case 'code':
        spinner.start('Analyzing code for review...');
        
        const recentFiles = await findRecentlyModifiedFiles();
        
        spinner.succeed('Code analysis complete!');
        
        console.log(chalk.yellow('\nRecent Changes:'));
        recentFiles.slice(0, 10).forEach(file => {
          console.log(chalk.gray(`- ${file.path} (${file.timeAgo})`));
        });
        
        console.log(chalk.yellow('\nReview Instructions:'));
        console.log(chalk.gray(`1. Select files to review`));
        console.log(chalk.gray(`2. Open ${options.ai}`));
        console.log(chalk.gray('3. Use this prompt:'));
        console.log(chalk.cyan('\n' + reviewPrompts[options.ai].code));
        
        if (options.security) {
          console.log(chalk.red('\n+ Security Focus:'));
          console.log(chalk.gray('- Check for hardcoded credentials'));
          console.log(chalk.gray('- Validate input sanitization'));
          console.log(chalk.gray('- Review authentication/authorization'));
        }
        
        if (options.performance) {
          console.log(chalk.blue('\n+ Performance Focus:'));
          console.log(chalk.gray('- Identify N+1 queries'));
          console.log(chalk.gray('- Check for unnecessary loops'));
          console.log(chalk.gray('- Review caching opportunities'));
        }
        break;
        
      case 'all':
        console.log(chalk.cyan('\nComprehensive Review Mode'));
        console.log(chalk.gray('Review both plan and code implementation'));
        
        console.log(chalk.yellow('\nSuggested workflow:'));
        console.log(chalk.gray('1. Review plan first for architectural issues'));
        console.log(chalk.gray('2. Review code against the plan'));
        console.log(chalk.gray('3. Check for consistency between plan and implementation'));
        console.log(chalk.gray('4. Identify gaps or deviations'));
        break;
        
      default:
        throw new Error(`Unknown target: ${target}. Use plan, code, or all.`);
    }
    
  } catch (error) {
    spinner.fail('Review preparation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

async function findRecentlyModifiedFiles() {
  const glob = require('glob');
  const files = glob.sync('**/*.{js,ts,jsx,tsx,py,java,go}', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });
  
  const fileStats = await Promise.all(
    files.map(async (file) => {
      const stats = await fs.stat(file);
      return {
        path: file,
        mtime: stats.mtime,
        timeAgo: getTimeAgo(stats.mtime)
      };
    })
  );
  
  return fileStats.sort((a, b) => b.mtime - a.mtime);
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}