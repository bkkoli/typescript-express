import { estypes } from '@elastic/elasticsearch'

import type { Service } from '../../types/system'

export class BasicService<T> implements Service<T> {
  async create({ doc }: { doc: T }): Promise<string> {
    const { _id } = await global.app.elasticClient.index({ index: 'signage-server', body: { properties: { ...doc } } as Record<string, unknown> })
    return _id
  }

  async getAll(): Promise<{ total: number; rows: T[] }> {
    const results = await global.app.elasticClient.search({ index: 'signage-server', query: { match_all: {} }, size: 10000, from: 0 })
    return results
  }

  async get({ docId }: { docId: string }): Promise<T> {
    const doc = await global.app.elasticClient.get({ index: 'signage-server', id: docId })
    return doc
  }
  async update({ docId, doc }: { docId: string; doc: T }): Promise<void> {
    await global.app.elasticClient.update({ index: 'signage-server', id: docId, body: { doc: { properties: { ...doc } } } })
  }

  async delete({ docId }: { docId: string }): Promise<void> {
    await global.app.elasticClient.delete({ index: 'signage-server', id: docId })
  }

  async search({ query }: { query: estypes.QueryDslQueryContainer }): Promise<{ total: number; rows: T[] }> {
    const results = await global.app.elasticClient.search({ index: 'signage-server', query, size: 10000, from: 0 })
    return results
  }
}
