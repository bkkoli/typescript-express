/* Related With CLI */
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

/* Related With environment */
import dotenv from 'dotenv'
import path from 'path'

const { npm_package_name = '', npm_package_version = '' } = process.env

console.info(chalk.green.bold(figlet.textSync(`${npm_package_name.toUpperCase()} @ ${npm_package_version}`)))

import App from './app.js'
import ElasticClient from './utils/db/elasticClient.js'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env['__filename'] = __filename
process.env['__dirname'] = __dirname

const main = async ({ env = '' }: { env: string }): Promise<void> => {
  let fileName = 'dev.env'
  if (env.includes('prod')) fileName = 'prod.env'

  const envPath = path.join(__dirname, 'configs', fileName)
  dotenv.config({ path: envPath })

  const elasticClient = new ElasticClient(process.env.ES_NODE || 'http://localhost:9200')

  await elasticClient.info()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  globalThis.app = new App({ port: process?.env?.PORT as string, mqttBrokerUrl: 'mqtt://test.mosquitto.org', elasticClient })
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'env',
      message: 'Choose your env file',
      choices: ['dev', 'prod'],
    },
  ])
  .then(async answers => {
    const { env }: { env: string } = answers
    main({ env })
  })
  .catch(error => {
    console.error(chalk.red.bold(error.stack))
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
