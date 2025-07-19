const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const glob = require('glob');

module.exports = async (options) => {
  const spinner = ora();
  
  try {
    console.log(chalk.cyan('\nCodebase Mapping Configuration:'));
    console.log(chalk.gray(`Parallel agents: ${options.parallelAgents ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.gray(`Knowledge graph: ${options.knowledgeGraph ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.gray(`Auto-sections: ${options.sections ? 'Enabled' : 'Disabled'}`));
    console.log(chalk.gray(`Verification: ${options.verify ? 'Enabled' : 'Disabled'}`));
    
    spinner.start('Analyzing codebase structure...');
    
    const files = glob.sync('**/*.{js,ts,jsx,tsx,py,java,go,rs,rb,php}', {
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
    });
    
    const stats = {
      totalFiles: files.length,
      byExtension: {},
      byDirectory: {}
    };
    
    files.forEach(file => {
      const ext = path.extname(file);
      const dir = path.dirname(file).split('/')[0];
      
      stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
      stats.byDirectory[dir] = (stats.byDirectory[dir] || 0) + 1;
    });
    
    spinner.succeed('Codebase analysis complete!');
    
    console.log(chalk.cyan('\nCodebase Statistics:'));
    console.log(chalk.gray(`Total files: ${stats.totalFiles}`));
    console.log(chalk.gray('\nBy extension:'));
    Object.entries(stats.byExtension)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([ext, count]) => {
        console.log(chalk.gray(`  ${ext}: ${count} files`));
      });
    
    if (options.sections) {
      console.log(chalk.cyan('\nIdentified Sections:'));
      Object.entries(stats.byDirectory)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([dir, count]) => {
          console.log(chalk.gray(`  ${dir}/: ${count} files`));
        });
    }
    
    console.log(chalk.yellow('\nMapping Strategy:'));
    
    if (options.parallelAgents) {
      console.log(chalk.gray('\nPhase 1: Section Identification'));
      console.log(chalk.gray('- Launch parallel agents to identify logical sections'));
      console.log(chalk.gray('- Analyze dependencies and relationships'));
      console.log(chalk.gray('- Create section manifest'));
      
      console.log(chalk.gray('\nPhase 2: Parallel Indexing'));
      console.log(chalk.gray('- Assign sections to parallel agents'));
      console.log(chalk.gray('- Read and extract key information'));
      console.log(chalk.gray('- Store in knowledge graph'));
      
      if (options.verify) {
        console.log(chalk.gray('\nPhase 3: Verification'));
        console.log(chalk.gray('- Cross-check indexed information'));
        console.log(chalk.gray('- Fill gaps in coverage'));
        console.log(chalk.gray('- Validate relationships'));
      }
    }
    
    if (options.knowledgeGraph) {
      console.log(chalk.cyan('\nKnowledge Graph Integration:'));
      console.log(chalk.gray('- Store entities: Classes, Functions, Modules'));
      console.log(chalk.gray('- Map relationships: Dependencies, Inheritance, Usage'));
      console.log(chalk.gray('- Index patterns: Design patterns, Conventions'));
    }
    
    console.log(chalk.yellow('\nRecommended prompt for mapping:'));
    console.log(chalk.gray('"Map this entire codebase using parallel agents via the task tool.'));
    console.log(chalk.gray('Phase 1: Identify sections. Phase 2: Index in parallel.'));
    console.log(chalk.gray('Store all findings in the configured knowledge graph."'));
    
  } catch (error) {
    spinner.fail('Codebase mapping failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};