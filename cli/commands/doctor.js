const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

module.exports = async (options) => {
  const spinner = ora();
  console.log(chalk.cyan('\n🩺 Claude Code Doctor\n'));
  
  const checks = [
    {
      name: 'Project structure',
      check: async () => {
        const required = ['CLAUDE.md', 'PLAN.md', 'memory-bank', '.claude'];
        const missing = [];
        
        for (const item of required) {
          if (!await fs.pathExists(path.join(process.cwd(), item))) {
            missing.push(item);
          }
        }
        
        return {
          pass: missing.length === 0,
          message: missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'All required files present',
          fix: async () => {
            for (const item of missing) {
              if (item.includes('.')) {
                await fs.writeFile(path.join(process.cwd(), item), `# ${item}\n\n[Generated by doctor]`);
              } else {
                await fs.ensureDir(path.join(process.cwd(), item));
              }
            }
          }
        };
      }
    },
    {
      name: 'Memory bank files',
      check: async () => {
        const memoryPath = path.join(process.cwd(), 'memory-bank');
        if (!await fs.pathExists(memoryPath)) {
          return { pass: false, message: 'Memory bank missing' };
        }
        
        const required = ['projectBrief.md', 'techContext.md', 'systemPatterns.md', 'activeContext.md', 'progress.md'];
        const existing = await fs.readdir(memoryPath);
        const missing = required.filter(f => !existing.includes(f));
        
        return {
          pass: missing.length === 0,
          message: missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'All memory files present',
          fix: async () => {
            for (const file of missing) {
              await fs.writeFile(
                path.join(memoryPath, file),
                `# ${file.replace('.md', '').replace(/([A-Z])/g, ' $1').trim()}\n\n[Generated by doctor]`
              );
            }
          }
        };
      }
    },
    {
      name: 'Git repository',
      check: async () => {
        try {
          execSync('git status', { stdio: 'ignore' });
          return { pass: true, message: 'Git initialized' };
        } catch {
          return {
            pass: false,
            message: 'Not a git repository',
            fix: async () => {
              execSync('git init');
              await fs.writeFile('.gitignore', 'node_modules/\n.env\n.DS_Store\n');
            }
          };
        }
      }
    },
    {
      name: 'Configuration',
      check: async () => {
        const configPath = path.join(process.cwd(), '.claude/config.json');
        if (!await fs.pathExists(configPath)) {
          return {
            pass: false,
            message: 'Configuration missing',
            fix: async () => {
              await fs.ensureDir(path.join(process.cwd(), '.claude'));
              await fs.writeJSON(configPath, {
                version: '1.0.0',
                created: new Date().toISOString(),
                settings: {
                  contextWarningThreshold: 50,
                  autoCommit: false
                }
              }, { spaces: 2 });
            }
          };
        }
        return { pass: true, message: 'Configuration found' };
      }
    },
    {
      name: 'YOLO settings',
      check: async () => {
        const settingsPath = path.join(process.cwd(), 'settings.json');
        if (!await fs.pathExists(settingsPath)) {
          return {
            pass: false,
            message: 'YOLO settings not found',
            warning: true,
            fix: async () => {
              const frameworkSettings = path.join(__dirname, '../../settings.json');
              if (await fs.pathExists(frameworkSettings)) {
                await fs.copy(frameworkSettings, settingsPath);
              }
            }
          };
        }
        return { pass: true, message: 'YOLO mode available' };
      }
    },
    {
      name: 'Node.js version',
      check: async () => {
        const version = process.version;
        const major = parseInt(version.split('.')[0].substring(1));
        
        return {
          pass: major >= 16,
          message: `Node.js ${version}`,
          warning: major < 16,
          fix: null
        };
      }
    },
    {
      name: 'MCP servers',
      check: async () => {
        const settingsPath = path.join(process.cwd(), 'settings.json');
        if (await fs.pathExists(settingsPath)) {
          const settings = await fs.readJSON(settingsPath);
          const mcpCount = Object.keys(settings.mcpServers || {}).length;
          return {
            pass: mcpCount > 0,
            message: `${mcpCount} MCP servers configured`,
            info: true
          };
        }
        return { pass: true, message: 'No settings.json', info: true };
      }
    }
  ];
  
  const results = [];
  
  for (const check of checks) {
    if (options.verbose) {
      spinner.start(`Checking ${check.name}...`);
    }
    
    try {
      const result = await check.check();
      results.push({ ...check, ...result });
      
      if (options.verbose) {
        if (result.pass) {
          spinner.succeed(`${check.name}: ${result.message}`);
        } else if (result.warning) {
          spinner.warn(`${check.name}: ${result.message}`);
        } else {
          spinner.fail(`${check.name}: ${result.message}`);
        }
      }
    } catch (error) {
      results.push({
        ...check,
        pass: false,
        message: error.message
      });
      if (options.verbose) {
        spinner.fail(`${check.name}: ${error.message}`);
      }
    }
  }
  
  if (!options.verbose) {
    results.forEach(result => {
      const icon = result.pass ? chalk.green('✓') : result.warning ? chalk.yellow('⚠') : chalk.red('✗');
      console.log(`${icon} ${result.name}: ${chalk.gray(result.message)}`);
    });
  }
  
  const issues = results.filter(r => !r.pass && !r.warning);
  const warnings = results.filter(r => r.warning);
  
  console.log(chalk.cyan('\nDiagnosis Summary:'));
  console.log(chalk.green(`✓ Passed: ${results.filter(r => r.pass).length}`));
  if (warnings.length > 0) {
    console.log(chalk.yellow(`⚠ Warnings: ${warnings.length}`));
  }
  if (issues.length > 0) {
    console.log(chalk.red(`✗ Issues: ${issues.length}`));
  }
  
  if (options.fix && (issues.length > 0 || warnings.length > 0)) {
    console.log(chalk.yellow('\nAttempting fixes...'));
    
    for (const result of [...issues, ...warnings]) {
      if (result.fix) {
        const fixSpinner = ora(`Fixing ${result.name}...`).start();
        try {
          await result.fix();
          fixSpinner.succeed(`Fixed ${result.name}`);
        } catch (error) {
          fixSpinner.fail(`Failed to fix ${result.name}: ${error.message}`);
        }
      }
    }
    
    console.log(chalk.green('\n✓ Fixes applied! Run doctor again to verify.'));
  } else if (issues.length > 0) {
    console.log(chalk.yellow('\nRun with --fix to attempt automatic fixes'));
  } else {
    console.log(chalk.green('\n✓ Your Claude Code setup is healthy!'));
  }
};