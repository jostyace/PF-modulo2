import { createPool } from 'mysql2/promise'
import { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT } from './config.js'

export const pool = createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT
})
