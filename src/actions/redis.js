import Redis from 'ioredis'
import { config } from '../../config/config'

export const connectRedis = () => new Redis(config.redisAddress)
