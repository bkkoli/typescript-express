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
import OpensearchClient from './utils/db/opensearchClient.js'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env['__filename'] = __filename
process.env['__dirname'] = __dirname

const runApp = async (): Promise<void> => {
  let dbClient: ElasticClient | OpensearchClient

  if (process.env.DB_TYPE === 'elastic') dbClient = new ElasticClient(process.env.ES_NODE || 'http://localhost:9200')
  else dbClient = new OpensearchClient(process.env.OSS_NODE || 'http://localhost:9200')

  await dbClient.info()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  globalThis.app = new App({ port: process?.env?.PORT as string, mqttBrokerUrl: 'mqtt://test.mosquitto.org', dbClient })
}

const runAppWithEnvFile = async () => {
  const { envFileName }: { envFileName: string } = await inquirer.prompt([
    {
      type: 'input',
      name: 'envFileName',
      message: 'env file명을 입력해주세요',
    },
  ])

  const envPath = path.join(__dirname, 'configs', envFileName)
  dotenv.config({ path: envPath })
  await runApp()
}

const runAppWithUserInput = async () => {
  try {
    const { isUseEnvFile }: { isUseEnvFile: boolean } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isUseEnvFile',
        message: '.env 파일 사용여부를 정해주세요',
      },
    ])

    if (isUseEnvFile) {
      await runAppWithEnvFile()
      return
    }

    const answers: Record<string, any> = await inquirer.prompt([
      {
        type: 'list',
        name: 'NODE_ENV',
        message: '서버 실행환경을 선택해주세요',
        choices: ['development', 'production'],
      },
      {
        type: 'input',
        name: 'PORT',
        message: '서버 PORT를 입력해주세요',
      },
      {
        type: 'list',
        name: 'DB_TYPE',
        message: 'DB Type를 입력해주세요',
        choices: ['elastic', 'opensearch'],
      },
      {
        type: 'input',
        name: 'ES_NODE',
        message: '엘라스틱 서치 노드를 입력해주세요(예: http://localhost:9200)',
      },
    ])

    process.env = { ...process.env, ...answers }

    await runApp()
  } catch (error) {
    if (error instanceof Error) console.error(chalk.red.bold(error?.stack))
    // if (error.isTtyError) {
    //   // Prompt couldn't be rendered in the current environment
    // } else {
    //   // Something else went wrong
    // }
  }
}

if (process.env?.NODE_ENV === 'debug') runApp()
else runAppWithUserInput()
