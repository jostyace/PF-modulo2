import { config } from 'dotenv'

config()

export const DB_DATABASE = process.env.DB_DATABASE || 'railway'
export const DB_HOST = process.env.DB_HOST || 'monorail.proxy.rlwy.net'
export const DB_USERNAME = process.env.DB_USERNAME || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'OTCmaPAZVnWcdfFyziNOvOkDuHgZPQwi'
export const DB_PORT = process.env.DB_PORT || 31190
export const PORT = process.env.PORT || 3001
