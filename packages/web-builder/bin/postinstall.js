const chalk = require('chalk')
const figlet = require('figlet')
const consola = require('consola')
const { PROJECT_NAME } = require('@growing-web/web-builder-constants')

consola.log(chalk.cyan(figlet.textSync(PROJECT_NAME)))
