import { Client, estypes } from '@elastic/elasticsearch'

class ElasticClient {
  #client
  constructor(node: string) {
    this.#client = new Client({
      node,
    })
  }

  async info(): Promise<void> {
    await this.#client.info()
  }

  async index({ index, body = {} }: { index: string; body: Record<string, unknown> }) {
    const res: estypes.IndexResponse = await this.#client.index({
      index,
      body,
    })
    return res
  }

  async search({
    index,
    query = {},
    size = 0,
    from = 0,
  }: {
    index: string
    query: estypes.QueryDslQueryContainer
    size: number
    from: number
  }): Promise<{ total: number; rows: any[] }> {
    const res: estypes.SearchResponse = await this.#client.search({
      index,
      query,
      size,
      from,
    })

    const { hits } = res ?? {}
    const { total = {}, hits: results = [] } = hits ?? {}
    const { value = 0 } = total as estypes.SearchTotalHits

    return { total: value, rows: results?.map(({ _id, _source }) => ({ _id, ...(_source as Record<string, unknown>) })) }
  }

  async get({ index, id }: { index: string; id: string }): Promise<any> {
    const res: estypes.GetResponse = await this.#client.get({
      index,
      id,
    })

    const { _id, _source = {} } = res

    return { _id, ...(_source as Record<string, unknown>) }
  }

  async update({ index, id, body = {} }: { index: string; id: string; body: Record<string, unknown> }) {
    const res: estypes.UpdateResponse = await this.#client.update({
      index,
      id,
      body,
    })
    return res
  }

  async delete({ index, id }: { index: string; id: string }) {
    await this.#client.delete({
      index,
      id,
    })
  }

  async close() {
    await this.#client.close()
  }
}

export default ElasticClient
