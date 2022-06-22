import { Client } from '@opensearch-project/opensearch'

class OpensearchClient {
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
    const res = await this.#client.index({
      index,
      body,
    })
    return res?.body
  }

  async search({
    index,
    query = {},
    size = 0,
    from = 0,
  }: {
    index: string
    query: Record<string, any>
    size: number
    from: number
  }): Promise<{ total: number; rows: any[] }> {
    const res = await this.#client.search(
      {
        index,
        body: { query },
        size,
        from,
      },
      {}
    )

    const { hits } = res?.body ?? {}
    const { total = {}, hits: results = [] } = hits ?? {}
    const { value = 0 } = total

    return { total: value, rows: results?.map(({ _id, _source }: { _id: string; _source: Record<string, unknown> }) => ({ _id, ..._source })) }
  }

  async get({ index, id }: { index: string; id: string }): Promise<any> {
    const res = await this.#client.get({
      index,
      id,
    })

    const { _id, _source = {} } = res?.body ?? {}

    return { _id, ...(_source as Record<string, unknown>) }
  }

  async update({ index, id, body = {} }: { index: string; id: string; body: Record<string, unknown> }) {
    await this.#client.update({
      index,
      id,
      body,
    })
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

export default OpensearchClient
