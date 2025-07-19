const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const Conf = require('conf');

module.exports = async (action, options) => {
  const projectConfigPath = path.join(process.cwd(), '.claude/config.json');
  const globalConfig = new Conf({ projectName: 'claude-code-framework' });
  
  try {
    switch (action) {
      case 'show':
        console.log(chalk.cyan('\nClaude Code Configuration:\n'));
        
        if (await fs.pathExists(projectConfigPath)) {
          const projectConfig = await fs.readJSON(projectConfigPath);
          console.log(chalk.yellow('Project Configuration:'));
          console.log(JSON.stringify(projectConfig, null, 2));
        }
        
        const globalSettings = globalConfig.store;
        if (Object.keys(globalSettings).length > 0) {
          console.log(chalk.yellow('\nGlobal Configuration:'));
          console.log(JSON.stringify(globalSettings, null, 2));
        }
        
        console.log(chalk.cyan('\nAvailable Keys:'));
        console.log(chalk.gray('- contextWarningThreshold (number): Context usage warning level'));
        console.log(chalk.gray('- autoCommit (boolean): Auto-commit on session end'));
        console.log(chalk.gray('- parallelExecution (boolean): Enable parallel execution'));
        console.log(chalk.gray('- crossCheckAI (string): Default AI for cross-checking'));
        console.log(chalk.gray('- yoloMode (boolean): Enable YOLO mode by default'));
        console.log(chalk.gray('- defaultTemplate (string): Default project template'));
        console.log(chalk.gray('- defaultStack (string): Default technology stack'));
        break;
        
      case 'set':
        if (!options.key || options.value === undefined) {
          throw new Error('Both --key and --value are required');
        }
        
        const value = parseValue(options.value);
        
        if (options.global) {
          globalConfig.set(options.key, value);
          console.log(chalk.green(`✓ Global config set: ${options.key} = ${value}`));
        } else {
          if (!await fs.pathExists(projectConfigPath)) {
            await fs.ensureDir(path.dirname(projectConfigPath));
            await fs.writeJSON(projectConfigPath, { settings: {} }, { spaces: 2 });
          }
          
          const config = await fs.readJSON(projectConfigPath);
          if (!config.settings) config.settings = {};
          config.settings[options.key] = value;
          
          await fs.writeJSON(projectConfigPath, config, { spaces: 2 });
          console.log(chalk.green(`✓ Project config set: ${options.key} = ${value}`));
        }
        break;
        
      case 'reset':
        if (options.global) {
          globalConfig.clear();
          console.log(chalk.green('✓ Global configuration reset'));
        } else {
          if (await fs.pathExists(projectConfigPath)) {
            const config = await fs.readJSON(projectConfigPath);
            config.settings = {
              contextWarningThreshold: 50,
              autoCommit: false,
              parallelExecution: true
            };
            await fs.writeJSON(projectConfigPath, config, { spaces: 2 });
            console.log(chalk.green('✓ Project configuration reset to defaults'));
          }
        }
        break;
        
      case 'get':
        if (!options.key) {
          throw new Error('--key is required');
        }
        
        let value;
        if (options.global) {
          value = globalConfig.get(options.key);
        } else if (await fs.pathExists(projectConfigPath)) {
          const config = await fs.readJSON(projectConfigPath);
          value = config.settings?.[options.key];
        }
        
        if (value !== undefined) {
          console.log(value);
        } else {
          console.log(chalk.gray('(not set)'));
        }
        break;
        
      default:
        throw new Error(`Unknown action: ${action}. Use show, set, get, or reset.`);
    }
    
  } catch (error) {
    console.error(chalk.red(`Config error: ${error.message}`));
    process.exit(1);
  }
};

function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value)) return Number(value);
  return value;
}