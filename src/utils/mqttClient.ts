import mqtt from 'mqtt'

interface MqttClientInterface {
  close(): void
}

class MqttClient implements MqttClientInterface {
  #client
  constructor({ url, onConnect, onMessage }: { url: string; onConnect: () => void; onMessage: (topic: string, message: string) => void }) {
    const client = mqtt.connect(url)
    // TODO: viewtrack plugin ON
    //   - viewtrack.api.setToken({ baseurl, token })
    //   - const { site } = await viewtrack.api.getConfig()
    //   - const { service } = await viewtrack.api.getServices()
    //   - oneM2M
    //   - /req/oneM2M/{serviceLabel}/Aliot{siteid}/NULL/NULL/{properties.deviceId}/{value,event,scene,...}
    //  client.subscribe('/req/oneM2M/{serviceLabel}/Aliot{siteid}/NULL/NULL/{properties.deviceId}/value', function () {
    // client.publish('/signage/{hwid}/setup', message)
    // })
    client.on('connect', onConnect)

    // 1. 'setup' === topic
    // if (!message.pkey) 등록대기({ hwid })
    // else {
    //    hwid + message.pkey = HMAC-SHA512 SECRET
    //    if( DB조회({ SECRET }) )
    //      client.publish('/signage/${hwid}/setup/value', 설정조회({ hwid }))
    //}
    client.on('message', onMessage)

    this.#client = client
  }

  get client() {
    return this.#client
  }

  close() {
    this.#client.end()
  }
}

export default MqttClient
