import { config } from 'dotenv'

config()

export const DB_DATABASE = process.env.DB_DATABASE || 'blog_system'
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_USERNAME = process.env.DB_USERNAME || 'usuario'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'P@$$w0rd'
export const DB_PORT = process.env.DB_PORT || 3306
export const PORT = process.env.PORT || 3000
