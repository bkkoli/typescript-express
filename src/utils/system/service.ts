import { estypes } from '@elastic/elasticsearch'

import type { Service } from '../../types/system'

export class BasicService<T> implements Service<T> {
  async create({ doc }: { doc: T }): Promise<string> {
    const { _id } = await global.app.dbClient.index({ index: 'example', body: { properties: { ...doc } } as Record<string, unknown> })
    return _id
  }

  async getAll(): Promise<{ total: number; rows: T[] }> {
    const results = await global.app.dbClient.search({ index: 'example', query: { match_all: {} }, size: 10000, from: 0 })
    return results
  }

  async get({ docId }: { docId: string }): Promise<T> {
    const doc = await global.app.dbClient.get({ index: 'example', id: docId })
    return doc
  }
  async update({ docId, doc }: { docId: string; doc: T }): Promise<void> {
    await global.app.dbClient.update({ index: 'example', id: docId, body: { doc: doc } })
  }

  async delete({ docId }: { docId: string }): Promise<void> {
    await global.app.dbClient.delete({ index: 'example', id: docId })
  }

  async search({ query }: { query: estypes.QueryDslQueryContainer }): Promise<{ total: number; rows: T[] }> {
    const results = await global.app.dbClient.search({ index: 'example', query, size: 10000, from: 0 })
    return results
  }
}
