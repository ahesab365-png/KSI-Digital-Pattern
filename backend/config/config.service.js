import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV || 'development'

if (!process.env.VERCEL) {
    const envPath = {
        development: `.env.development`,
        production: `.env.production`,
    }
    console.log({ en: envPath[NODE_ENV] });
    config({ path: resolve(`./config/${envPath[NODE_ENV]}`) })
}


export const port = process.env.PORT ?? 7000

export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = process.env.DB_PORT ?? 3306
export const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
export const DB_USER = process.env.DB_USER ?? 'root'
export const DB_NAME = process.env.DB_NAME ?? 'test'
export const DB_URI = process.env.DB_URI ?? `mongodb://127.0.0.1:27017/${DB_NAME}`


export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? '10')
console.log({SALT_ROUND});

export const CLOUD_NAME = process.env.CLOUD_NAME
export const API_KEY = process.env.API_KEY
export const API_SECRET = process.env.API_SECRET

export const JWT_SECRET = process.env.JWT_SECRET ?? 'ksi_fallback_secret_key_123'

