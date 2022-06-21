import { Request, Response, NextFunction } from 'express'

export interface Controller<T> {
  service: Service<T>
  create?(req: Request, res: Response, next: NextFunction): Promise<void>
  get?(req: Request, res: Response, next: NextFunction): Promise<void>
  getAll?(req: Request, res: Response, next: NextFunction): Promise<void>
  update?(req: Request, res: Response, next: NextFunction): Promise<void>
  delete?(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface Service<T> {
  name?: string
  create?({ doc }: { doc: T }): Promise<string>
  get?({ docId }: { docId: string }): Promise<T>
  getAll?(): Promise<{ total: number; rows: T[] }>
  update?({ docId, doc }: { docId: string; doc: T }): Promise<void>
  delete?({ docId }: { docId: string }): Promise<void>
}

export interface DBClient<T> {
  client: T
}
