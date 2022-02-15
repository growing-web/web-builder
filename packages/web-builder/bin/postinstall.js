const figlet = require('figlet')
const consola = require('consola')
const { PROJECT_NAME } = require('@growing-web/web-builder-constants')
const { colors } = require('@growing-web/web-builder-toolkit')

consola.log(colors.cyan(figlet.textSync(PROJECT_NAME)))
