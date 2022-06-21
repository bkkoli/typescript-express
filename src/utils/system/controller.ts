import { Request, Response, NextFunction } from 'express'

import type { Service, Controller } from '../../types/system'

export class BasicController<T> implements Controller<T> {
  #service
  constructor({ service }: { service: Service<T> }) {
    this.#service = service
  }

  get service(): Service<T> {
    return this.#service
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc: T = req?.body ?? {}
      const createdId = await this.#service.create?.({ doc: doc })
      res.status(201).send({ createdId })
    } catch (err) {
      next(err)
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await this.#service.getAll?.()
      res.status(200).send(docs)
    } catch (err) {
      next(err)
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const docId: string = req?.params?.docId ?? ''
      const doc = await this.#service.get?.({ docId: docId })
      res.status(200).send(doc)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, ...properties }: { _id: string } = req?.body as any
      await this.#service.update?.({ docId: _id, doc: properties as T })
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const docId: string = req.params.docId
      await this.#service.delete?.({ docId: docId })
      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
}
