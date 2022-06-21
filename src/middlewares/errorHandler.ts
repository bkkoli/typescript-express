import chalk from 'chalk'
import logger from '../utils/logger.js'

import { Request, Response, NextFunction } from 'express'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') logger.error(err.stack)
  else console.error(chalk.red.bold(err.stack))
  res.status(500).send('Internal Server Error')
}

export default errorHandler
