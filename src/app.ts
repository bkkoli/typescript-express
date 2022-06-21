import chalk from 'chalk'

// Middlewares
import { errorHandler } from './middlewares/index.js'

// Routers
import { exampleRouter } from './routes/index.js'

import express from 'express'
import path from 'path'

import MqttClient from './utils/mqttClient.js'
import ElasticClient from './utils/db/elasticClient.js'
import { Server } from 'http'

class App {
  #expressApp: any
  #mqttClient
  #elasticClient

  constructor({ port = 3000, mqttBrokerUrl, elasticClient }: { port: number | string; mqttBrokerUrl: string; elasticClient: ElasticClient }) {
    this.#elasticClient = elasticClient
    this.createExpressApp({ port })
    this.#mqttClient = new MqttClient({
      url: mqttBrokerUrl,
      onConnect: () => {
        this.subscribe({ topic: '/test' })
      },
      onMessage: this.onMessage,
    }).client
  }

  get expressApp() {
    return this.#expressApp
  }

  get elasticClient() {
    return this.#elasticClient
  }

  get mqttClient() {
    return this.#mqttClient
  }

  createExpressApp({ port }: { port: string | number }) {
    console.info(chalk.green.bold(`[ Signage Server is Running on ${process.env.NODE_ENV} mode ]`))

    const app = express()
    const PORT = port || 3000

    // Urlencoded payloads Parser
    app.use(express.urlencoded())
    // Json payloads Parser
    app.use(express.json())

    // Static Files Router
    app.use(express.static(path.join(process.env.__dirname as string, 'public')))

    // REST APIs
    app.get('/', (req, res) => {
      res.send("<h2>It's Working!</h2>")
    })

    app.use('/api/examples', exampleRouter)

    app.get('/error', (req, res, next) => {
      try {
        throw new Error('error test')
      } catch (err) {
        next(err)
      }
    })

    app.use(errorHandler)

    const server: Server = app.listen(PORT, () => {
      console.log(chalk.green.bold(`[ API is listening on port ${PORT} ]`))
    })

    this.#expressApp = server
  }

  subscribe({ topic }: { topic: string }) {
    this.#mqttClient.subscribe(topic, function (err) {
      if (err) console.error(err)
    })
  }
  onMessage(topic: string, message: string) {
    console.info(topic)
    // message is Buffer
    console.log(message.toString())
  }
}

export default App
