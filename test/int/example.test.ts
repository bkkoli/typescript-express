/// <reference types="jest" />
import request from 'supertest'
import App from '../../src/app.js'
import ElasticClient from '../../src/utils/db/elasticClient.js'
import OpensearchClient from '../../src/utils/db/opensearchClient.js'

import type { Example } from '../../src/types/model'

let app: App, dbClient: ElasticClient | OpensearchClient, exampleId: string

const example: Example = {
  _id: '',
  name: 'test',
}

const exampleUpdated: Example = {
  _id: '',
  name: 'updated',
}

describe('Example Router Intergration Test', () => {
  beforeAll(async () => {
    dbClient = new OpensearchClient('http://localhost:9200')
    app = new App({ port: 8000, mqttBrokerUrl: `mqtt://${process.env.mqtt_url}`, dbClient })
    global.app = app
  })

  afterAll(async () => {
    await dbClient.close()
    if (app.mqttClient && app.mqttClient.connected)
      await app.mqttClient.unsubscribe('/test', async (err: Error) => {
        if (!err) await app.mqttClient.end()
      })

    if (app.expressApp && app.expressApp.listening) await app.expressApp.close()
  })

  test('Server is Running Well', async () => {
    const response = await request(app.expressApp).get('/')
    expect(response.statusCode).toBe(200)
  })

  test('Create Example', async () => {
    const { _id, ...body } = example
    const response = await request(app.expressApp).post('/api/examples').send(body)
    exampleId = response.body.createdId
    expect(response.statusCode).toBe(201)
  })

  test('Get Examples', async () => {
    const response = await request(app.expressApp).get('/api/examples')
    expect(response.statusCode).toBe(200)
  })

  test('Get Example', async () => {
    const response = await request(app.expressApp).get(`/api/examples/${exampleId}`)
    expect(response.statusCode).toBe(200)
  })

  test('Update Example', async () => {
    const response = await request(app.expressApp)
      .put('/api/examples')
      .send({ ...exampleUpdated, _id: exampleId })
    expect(response.statusCode).toBe(204)
  })

  test('Delete Example', async () => {
    const response = await request(app.expressApp).delete(`/api/examples/${exampleId}`)

    expect(response.statusCode).toBe(204)
  })
})
